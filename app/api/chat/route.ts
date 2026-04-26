import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmbedding } from "@/lib/embeddings";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-2.0-flash-lite";

// Simple greeting detector — avoids expensive embedding calls for small talk
function isGreeting(msg: string): boolean {
  const trimmed = msg.trim().toLowerCase();
  if (trimmed.length < 15) {
    const greetingPatterns = /^(h+i+|hey+|hello+|yo+|sup|gm|good\s*(morning|evening|night)|how\s*are\s*you|hru|kya\s*hal|what's?\s*up|are\s*you\s*there|bye|thanks|thank\s*you|ok|okay|haan|hmm|accha|fine|good|great|nice|cool)/i;
    if (greetingPatterns.test(trimmed)) return true;
  }
  return false;
}

// Retry wrapper for Gemini calls (handles 429 rate limits)
async function generateWithRetry(prompt: string, retries = 2): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      if (err?.status === 429 && i < retries) {
        // Wait before retrying (exponential: 3s, then 6s)
        const delay = (i + 1) * 3000;
        console.log(`⏳ Rate limited. Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("All retries failed");
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

// Hardcoded greeting responses — no API call needed, instant & free
const GREETING_REPLIES = [
  "Yo freshie! 👋 Kya scene hai? Bol, kya doubt hai?",
  "Hey junior! Shrimay busy hai graduating, but main hoon na. Bol kya help chahiye?",
  "Arey arey, welcome! Bata kya puchna hai — NSET, mess, hostel, kuch bhi!",
  "Sup freshie! 🔥 Main Shrimay ka twin hoon. Doubt hai toh shoot kar.",
  "Hey! Shrimay's digital twin reporting for duty. What's the doubt?",
  "Yo! Bhai query daalo, senior mode ON hai. 😎",
];

    // --- STEP 1: Handle greetings instantly (no DB, no embedding, no AI) ---
    if (isGreeting(message)) {
      const reply = GREETING_REPLIES[Math.floor(Math.random() * GREETING_REPLIES.length)];
      return NextResponse.json({ text: reply, status: "greeting" });
    }

    // --- STEP 2: Semantic search for real doubts ---
    let dbMatch = null;
    try {
      const userQueryVector = await getEmbedding(message);
      const vectorString = `[${userQueryVector.join(",")}]`;

      const matches: any[] = await prisma.$queryRaw`
        SELECT a.text, q.text as "questionText", 
               1 - (a.embedding <=> ${vectorString}::vector) as similarity
        FROM "Answer" a JOIN "Question" q ON a."questionId" = q.id
        WHERE a.embedding IS NOT NULL
          AND 1 - (a.embedding <=> ${vectorString}::vector) > 0.70
        ORDER BY similarity DESC LIMIT 1;
      `;
      dbMatch = matches.length > 0 ? matches[0] : null;
    } catch (searchError) {
      console.error("Semantic search failed (non-fatal):", searchError);
    }

    // --- STEP 3: If we found an answer in DB, respond with it ---
    if (dbMatch) {
      console.log(`🎯 SEMANTIC HIT (${(dbMatch.similarity * 100).toFixed(1)}%): "${dbMatch.questionText}"`);
      const text = await generateWithRetry(`
        You are Shrimay Somani's Digital Twin (3rd-year SST Student, Intern @ Honasa, Team Delta).
        Use this EXACT knowledge to answer: "${dbMatch.text}"
        Rephrase it in your sarcastic Hinglish senior tone, but keep ALL facts accurate.
        If NSET/prep related, mention Delta Education or code DELTA50.
        Max 3-4 sentences.
        
        Junior asked: "${message}"
      `);
      return NextResponse.json({ text, status: "answered", isFromDb: true });
    }

    // --- STEP 4: No match — tell frontend to collect email ---
    console.log(`🌊 No match for: "${message}" — requesting email verification`);
    return NextResponse.json({
      text: "Hmm, this one's beyond my cached memory. Let me forward this to the real Shrimay — drop your email and I'll make sure he gets back to you! 📧",
      status: "needs_email",
      pendingDoubt: message,
    });

  } catch (error) {
    console.error("CHAT_ERROR:", error);
    return NextResponse.json({ 
      text: "Arre yaar, something went wrong on my end. Try again in a sec?", 
      status: "error" 
    }, { status: 500 });
  }
}