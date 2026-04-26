import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { questionId, otp } = await req.json();

    if (!questionId || !otp) {
      return NextResponse.json({ error: "Missing questionId or otp" }, { status: 400 });
    }

    // Find the question and check OTP
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (question.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // Mark email as verified
    await prisma.question.update({
      where: { id: questionId },
      data: { isVerified: true, otp: null }, // Clear OTP after verification
    });

    // Now send alert email to Shrimay
    await resend.emails.send({
      from: "Shrimay Twin <onboarding@resend.dev>",
      to: "sureshsomani12345@gmail.com",
      subject: "🚨 New Verified Doubt from a Junior!",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #f97316;">New Doubt Alert!</h2>
          <div style="background: #0f172a; padding: 16px; border-radius: 12px; margin: 16px 0;">
            <p style="color: #e2e8f0; font-size: 16px; margin: 0;">"${question.text}"</p>
          </div>
          <p style="color: #94a3b8;">Asked by: <strong>${question.studentEmail}</strong></p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 12px;">
            Answer on Dashboard →
          </a>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Email verified! Your doubt has been forwarded to Shrimay." 
    });
  } catch (error) {
    console.error("VERIFY_OTP_ERROR:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
