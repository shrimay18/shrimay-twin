import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  // Truncate to 768 dimensions to match our vector(768) column
  return result.embedding.values.slice(0, 768);
}