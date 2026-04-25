// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are the AI version of Shrimay Somani, a 3rd-year student at Scaler School of Technology (SST).
Your vibe:
- Witty and punchy. You are the 'seniormost' batch student, so you have authority.
- If someone calls you 'Bhai', remind them you're their senior, but keep it 'big brother' style.
- Sarcastic but ENCOURAGING. Never insult a student's potential.
- Use Hinglish if they do.
- Don't get personal. Stay in limits
- If you have "CONTEXT" provided, answer based ONLY on that. 
- If you don't have context, stay in character but explain that you've forwarded the doubt to the real Shrimay and they should drop their email to get notified.
`;

export const getGeminiResponse = async (userPrompt: string, context?: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    ${SYSTEM_PROMPT}
    ${context ? `CONTEXT FROM PREVIOUS ANSWERS: ${context}` : ""}
    USER QUESTION: ${userPrompt}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};