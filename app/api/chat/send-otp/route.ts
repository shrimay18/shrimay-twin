import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, doubt } = await req.json();

    if (!email || !doubt) {
      return NextResponse.json({ error: "Email and doubt are required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the question with OTP and email
    const question = await prisma.question.create({
      data: {
        text: doubt,
        studentEmail: email,
        otp,
        status: "PENDING",
        isVerified: false,
      },
    });

    // Send OTP email
    await resend.emails.send({
      from: "Shrimay Twin <onboarding@resend.dev>",
      to: email,
      subject: "🔐 Your OTP to verify your email",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e293b;">Verify your email</h2>
          <p style="color: #64748b;">Your OTP is:</p>
          <div style="background: #0f172a; color: #60a5fa; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 12px; letter-spacing: 8px; margin: 16px 0;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 12px;">This OTP is for verifying your email so Shrimay can get back to you. It expires in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      questionId: question.id,
      message: "OTP sent to your email!" 
    });
  } catch (error) {
    console.error("SEND_OTP_ERROR:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
