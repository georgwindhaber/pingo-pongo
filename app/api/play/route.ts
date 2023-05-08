import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const save = await prisma.play.create({
    data: {
      winner: data.winnerId,
      looser: data.looserId,
    },
  });

  console.log(save);

  return NextResponse.json({ response: "ok" });
}
