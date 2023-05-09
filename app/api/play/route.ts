import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  console.log(data);

  // Todo: create players
  const save = await prisma.game.create({
    data: {
      winnerId: data.winnerId,
      looserId: data.looserId,
    },
  });

  return NextResponse.json({ response: "ok" });
}
