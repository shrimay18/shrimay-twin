import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmbedding } from "@/lib/embeddings";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. GENERATE VECTOR: Convert user query into a 768-dimension array
    const userQueryVector = await getEmbedding(message);

    // 2. SEMANTIC SEARCH: Query Supabase using Cosine Distance
    // We convert the array to a string format '[0.1, 0.2, ...]' for pgvector
    const vectorString = `[${userQueryVector.join(",")}]`;

    const matches: any[] = await prisma.$queryRaw`
      SELECT 
        a.text, 
        q.text as "questionText",
        1 - (a.embedding <=> ${vectorString}::vector) as similarity
      FROM "Answer" a
      JOIN "Question" q ON a."questionId" = q.id
      WHERE 1 - (a.embedding <=> ${vectorString}::vector) > 0.65
      ORDER BY similarity DESC
      LIMIT 1;
    `;

    const dbMatch = matches.length > 0 ? matches[0] : null;

    if (dbMatch) {
      console.log(`🎯 SEMANTIC HIT (${(dbMatch.similarity * 100).toFixed(2)}%): "${dbMatch.questionText}"`);
    } else {
      console.log(`🌊 NO SEMANTIC MATCH: Falling back to general AI knowledge.`);
    }

    // 3. BRAIN LOGIC: Feed the Ground Truth to Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const systemPrompt = `
      You are Shrimay Somani's Digital Twin (3rd Year SST Student).
      Tone: Friendly, witty, Hinglish speaker.
      
      ${
        dbMatch
          ? `CONTEXT FOUND IN MEMORY: "${dbMatch.text}"
             INSTRUCTION: Use the context above to answer. Rephrase it in your sarcastic senior tone, but keep the facts 100% accurate.`
          : "I don't have a specific memory for this. Answer as a sarcastic senior based on your general knowledge."
      }
      
      RULES:
      - Refer to the user as 'freshie' or 'junior'.
      - Mention 'Delta Education' or code 'DELTA50' for NSET prep.
      - If they ask about mess food, trigger 'Emotional Damage' protocol.
      - Keep it short (2-3 sentences).
    `;

    const result = await model.generateContent(`${systemPrompt}\n\nJunior: "${message}"`);
    const text = result.response.text();

    return NextResponse.json({
      text,
      isFromDb: !!dbMatch,
      confidence: dbMatch ? dbMatch.similarity : 0
    });

  } catch (error) {
    console.error("TWIN_BRAIN_ERROR:", error);
    return NextResponse.json(
      { text: "My brain just hit a segfault. Try again, junior." },
      { status: 500 }
    );
  }
}