import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type PlayerRequest = {
  body?: {
    ids?: number[];
  };
} & Request;

export async function GET(request: PlayerRequest) {
  let players = [];
  if (request?.body?.ids) {
    const ids = request.body.ids;
    players = await prisma.player.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } else {
    players = await prisma.player.findMany();
  }

  return NextResponse.json({ response: "ok", data: players, request });
}
