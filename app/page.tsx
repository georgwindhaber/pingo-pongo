"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";

type Player = {
  id: number;
  name: string;
  score: number;
  wins: number;
};
const disabledStyles = "opacity-50 hover:bg-slate-900";

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
      {players
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((player) => {
          let backgroundColor = "bg-slate-900 hover:bg-slate-800";
          if (winnerId === player.id && isWinner) {
            backgroundColor = "bg-green-700 hover:bg-green-600";
          }
          if (looserId === player.id && isLooser) {
            backgroundColor = "bg-red-700 hover:bg-red-600";
          }

          return (
            <label
              key={player.id}
              className={clsx(
                backgroundColor,
                "m-1 py-1 px-3 rounded-full text-center",
                winnerId === player.id && !isWinner && disabledStyles,
                looserId === player.id && !isLooser && disabledStyles
              )}
              htmlFor={resultType + player.id.toString()}
            >
              {player.name}
              <input
                type="radio"
                id={resultType + player.id.toString()}
                value={player.id}
                name={resultType}
                className="hidden"
                checked={
                  (isWinner && winnerId === player.id) ||
                  (isLooser && looserId === player.id)
                }
                onChange={() => {
                  if (player.id !== winnerId && player.id !== looserId) {
                    onPlayerSelect(player);
                  }
                }}
              />
            </label>
          );
        })}
    </form>
  );
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [looser, setLooser] = useState<Player | null>(null);
  const [plays, setPlays] = useState<Array<{ winner: Player; looser: Player }>>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlayers = async () => {
    setIsLoading(true);
    const playersRequest = await fetch("/api/player");
    const players = await playersRequest.json();
    setPlayers(players.data.sort((a: Player, b: Player) => b.id - a.id));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const submitRound = async () => {
    if (winner && looser) {
      setPlays([...plays, { winner, looser }]);
    }

    setWinner(null);
    setLooser(null);

    await fetch("/api/play", {
      method: "POST",
      body: JSON.stringify({ winnerId: winner?.id, looserId: looser?.id }),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));

    fetchPlayers();
  };

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
        <button
          type="button"
          className={clsx(
            "font-bold text-lg bg-slate-800 hover:bg-slate-700 m-1 py-1 px-5 rounded-full disabled:opacity-50 disabled:hover:bg-slate-800"
          )}
          onClick={submitRound}
          disabled={!(winner && looser)}
        >
          Submit
        </button>
      </div>
      <section className="mt-5">
        <h2 className="text-2xl font-bold">Magic skill number</h2>
        <Reorder.Group
          axis="y"
          values={players.sort((a, b) => b.score - a.score)}
          onReorder={() => undefined}
        >
          {players
            .sort((a, b) => b.id - a.id)
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <Reorder.Item key={player.id} value={player}>
                {index + 1}. {player.name} - {player.score}
              </Reorder.Item>
            ))}
        </Reorder.Group>
      </section>
      <section className="mt-5">
        <h2 className="text-2xl font-bold">Wins</h2>
        <Reorder.Group
          axis="y"
          values={players.sort((a, b) => b.score - a.score)}
          onReorder={() => undefined}
        >
          {players
            .sort((a, b) => b.id - a.id)
            .sort((a, b) => b.wins - a.wins)
            .map((player, index) => (
              <Reorder.Item key={player.id} value={player}>
                {index + 1}. {player.name} - {player.wins}
              </Reorder.Item>
            ))}
        </Reorder.Group>
      </section>
      {isLoading && <span className="loader opacity-70"></span>}
    </main>
  );
}
