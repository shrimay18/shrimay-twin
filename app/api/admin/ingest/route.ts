import { prisma } from "@/lib/prisma";
import { getEmbedding } from "@/lib/embeddings";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, secret } = await req.json();

    // 1. Simple Security Gate
    if (secret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Chunking (Splitting big text into smaller pieces)
    // For now, we split by paragraphs. In pro-apps, we use LangChain.
    const chunks = text.split("\n\n").filter((c: string) => c.trim().length > 10);

    for (const chunk of chunks) {
      // Generate a summary/question for this chunk (Optional: use Gemini for this)
      const mockQuestion = `Knowledge about: ${chunk.substring(0, 50)}...`;

      const createdAnswer = await prisma.answer.create({
        data: {
          text: chunk,
          question: {
            create: {
              text: mockQuestion,
              studentEmail: "admin@shrimay.me",
              status: "ANSWERED",
              isVerified: true
            }
          }
        }
      });

      // Vectorize and Inject
      const vector = await getEmbedding(chunk);
      const vectorString = `[${vector.join(',')}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE "Answer" SET embedding = '${vectorString}'::vector WHERE id = '${createdAnswer.id}'`
      );
    }

    return NextResponse.json({ success: true, chunksProcessed: chunks.length });
  } catch (e) {
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}