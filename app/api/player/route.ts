import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const players = await prisma.player.findMany();

  players.sort((a, b) => b.score - a.score);

  return NextResponse.json({ response: "ok", data: players });
}
