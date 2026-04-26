import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doubts = await prisma.question.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(doubts);
}