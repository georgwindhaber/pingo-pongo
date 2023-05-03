"use client";

import clsx from "clsx";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type Player = {
  id: number;
  name: string;
  score: number;
  state?: "winner" | "looser";
};

const Players: Array<Player> = [
  { id: 1, name: "Serhii", score: 0 },
  { id: 2, name: "Jonathan", score: 0 },
  { id: 3, name: "Freddy", score: 0 },
  { id: 4, name: "Cezary", score: 0 },
  { id: 5, name: "Ben", score: 0 },
  { id: 6, name: "Joao", score: 0 },
  { id: 7, name: "Karla", score: 0 },
  { id: 8, name: "Daryna", score: 0 },
];

const Results: Array<{ winner: number; looser: number }> = [
  { winner: 1, looser: 2 },
];

const PlayerSelect = ({
  players,
  winnerId,
  looserId,
  resultType,
  onPlayerSelect,
}: {
  players: Player[];
  winnerId?: number;
  looserId?: number;
  resultType: "winner" | "looser";
  onPlayerSelect: (player: Player) => void;
}) => {
  const isWinner = resultType === "winner";
  const isLooser = resultType === "looser";

  return (
    <form className="grid grid-cols-3 sm:grid-cols-4">
      {players.map((player) => (
        <div
          key={player.id}
          className={clsx(
            "bg-slate-900 hover:bg-slate-800 m-1 py-1 px-3 rounded-full text-center",
            winnerId === player.id &&
              isWinner &&
              "bg-green-700 hover:bg-green-600",
            looserId === player.id && isLooser && "bg-red-700 hover:bg-red-600",
            winnerId === player.id &&
              !isWinner &&
              "opacity-50 hover:bg-slate-900",
            looserId === player.id &&
              !isLooser &&
              "opacity-50 hover:bg-slate-900"
          )}
        >
          <label className="" htmlFor={resultType + player.id.toString()}>
            {player.name}
          </label>
          <input
            type="radio"
            id={resultType + player.id.toString()}
            value={player.id}
            name={resultType}
            className={clsx("hidden")}
            onChange={() => {
              if (player.id !== winnerId && player.id !== looserId) {
                onPlayerSelect(player);
              }
            }}
          />
        </div>
      ))}
    </form>
  );
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>(Players);
  const [winner, setWinner] = useState<Player | null>(null);
  const [looser, setLooser] = useState<Player | null>(null);

  return (
    <main className="flex flex-col items-center justify-between p-3">
      <h1 className="text-3xl font-bold">Pingo Pongo</h1>
      <h2>Enter new game:</h2>
      <div>
        Winner:
        <PlayerSelect
          players={players}
          winnerId={winner?.id}
          looserId={looser?.id}
          resultType="winner"
          onPlayerSelect={setWinner}
        />
      </div>
      <div className="mt-5">
        Looser:
        <PlayerSelect
          players={players}
          winnerId={winner?.id}
          looserId={looser?.id}
          resultType="looser"
          onPlayerSelect={setLooser}
        />
      </div>

      <div className="mt-5">
        <button className="font-bold text-lg bg-slate-800 hover:bg-slate-700 m-1 py-1 px-5 rounded-full">
          Submit
        </button>
      </div>
    </main>
  );
}
