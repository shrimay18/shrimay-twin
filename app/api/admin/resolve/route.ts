import { prisma } from "@/lib/prisma";
import { getEmbedding } from "@/lib/embeddings";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { questionId, answerText, secret } = await req.json();

    if (secret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Create the answer
    const answer = await prisma.answer.create({
      data: { text: answerText, questionId }
    });

    // 2. Update question status
    const question = await prisma.question.update({
      where: { id: questionId },
      data: { status: "ANSWERED", isVerified: true }
    });

    // 3. Vectorize the answer (fix: ::vector was inside the string quotes before)
    try {
      const vector = await getEmbedding(answerText);
      const vectorString = `[${vector.join(",")}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE "Answer" SET embedding = '${vectorString}'::vector WHERE id = '${answer.id}'`
      );
    } catch (vecError) {
      console.error("Vector embedding failed (non-fatal):", vecError);
    }

    // 4. Email the student with Shrimay's answer
    if (question.studentEmail && question.studentEmail !== "junior@shrimay.me") {
      try {
        await resend.emails.send({
          from: "Shrimay Twin <onboarding@resend.dev>",
          to: question.studentEmail,
          subject: "✅ Shrimay answered your doubt!",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #22c55e;">Your Doubt Has Been Answered! 🎉</h2>
              <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin: 12px 0;">
                <p style="color: #64748b; margin: 0; font-size: 13px;">You asked:</p>
                <p style="color: #1e293b; margin: 4px 0 0; font-weight: 600;">"${question.text}"</p>
              </div>
              <div style="background: #0f172a; padding: 16px; border-radius: 12px; margin: 12px 0;">
                <p style="color: #94a3b8; margin: 0; font-size: 13px;">Shrimay says:</p>
                <p style="color: #e2e8f0; margin: 8px 0 0; font-size: 15px; line-height: 1.6;">${answerText}</p>
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">— Shrimay's Digital Twin</p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error("Failed to email student:", mailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("RESOLVE_ERROR:", e);
    return NextResponse.json({ error: "Failed to resolve doubt" }, { status: 500 });
  }
}