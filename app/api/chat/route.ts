// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getGeminiResponse } from "@/lib/gemini";
import { sendNotificationToShrimay } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { question, email } = await req.json();

    // 1. Search for similar answers in DB
    const existingAnswer = await db.answer.findFirst({
      where: {
        question: { text: { contains: question, mode: 'insensitive' } }
      }
    });

    // 2. If we know the answer, respond immediately
    if (existingAnswer) {
      const aiResponse = await getGeminiResponse(question, existingAnswer.text);
      return NextResponse.json({ answer: aiResponse, status: "SUCCESS" });
    }

    // 3. If new, save to DB and trigger email notification
    await db.question.create({
      data: {
        text: question,
        studentEmail: email,
        status: "PENDING",
      }
    });

    // Send the "I'll ask Shrimay" witty response
    const aiResponse = await getGeminiResponse(question); 
    
    // Lazy feature: Notify you so you don't have to check the app manually
    await sendNotificationToShrimay(question, email);

    return NextResponse.json({ 
      answer: aiResponse, 
      status: "FORWARDED" 
    });

  } catch (error) {
    console.error("Twin Logic Error:", error);
    return NextResponse.json({ error: "Brain freeze. Try again." }, { status: 500 });
  }
}