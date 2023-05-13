import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const playRequest = prisma.game.create({
    data: {
      winnerId: data.winnerId,
      looserId: data.looserId,
    },
  });

  const winnerRequest = prisma.player.findUnique({
    where: {
      id: data.winnerId,
    },
  });
  const looserRequest = prisma.player.findUnique({
    where: {
      id: data.winnerId,
    },
  });

  const [play, winner, looser] = await Promise.all([
    playRequest,
    winnerRequest,
    looserRequest,
  ]);

  const newWinnerProbability =
    1 / (1 + 10 ** ((looser.score - winner.score) / 400));
  const newLooserProbability =
    1 / (1 + 10 ** ((winner.score - looser.score) / 400));

  const newWinnerScore = winner.score + 50 * (1 - newWinnerProbability);
  const newLooserScore = looser.score + 50 * (0 - newLooserProbability);

  const setWinnerRequest = prisma.player.update({
    where: {
      id: data.winnerId,
    },
    data: {
      score: newWinnerScore,
    },
  });
  const setLooserRequest = prisma.player.update({
    where: {
      id: data.looserId,
    },
    data: {
      score: newLooserScore,
    },
  });

  await Promise.all([setWinnerRequest, setLooserRequest]);

  console.log(
    newWinnerScore,
    newWinnerProbability,
    newLooserScore,
    newLooserProbability
  );

  return NextResponse.json({ response: "ok" });
}
