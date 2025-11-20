// Necessary component to fetch and report liveDelta for a drafted player since using usePlayerDelta in a loop is not feasible
import { useEffect } from "react";

import { usePlayerDelta } from "@/hooks/usePlayerDelta";

import { Player } from "@/types";

function DraftedPlayerDelta({
  player,
  onDelta,
}: {
  player: Player,
  onDelta: (playerId: number, playerSport: string, liveDelta: number | undefined) => void
}) {
  const delta = usePlayerDelta(player.sport.toLowerCase() as 'football' | 'nba' | 'f1', player.id);
  useEffect(() => {
    onDelta(player.id, player.sport, delta?.liveDelta);
  }, [delta?.liveDelta, player.id, player.sport]);
  return null;
}

export default DraftedPlayerDelta;
