import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function usePlayerDelta(playerId: number) {
  const [delta, setDelta] = useState<{ liveDelta: number; previewPrice: number } | null>(null);

  useEffect(() => {
    // points to logic service 
    const ws = io('/ws/football', { transports: ['websocket'] }); // adjust base URL in prod

    ws.emit('subscribe', { type: 'player', playerId });
    const onMsg = (msg: { playerId: number; liveDelta: number; previewPrice: number }) => {
      if (msg.playerId === playerId) setDelta({ liveDelta: msg.liveDelta, previewPrice: msg.previewPrice });
    };
    ws.on('playerWeekDelta', onMsg);

    return () => {
      ws.off('playerWeekDelta', onMsg);
      ws.close();
    };
  }, [playerId]);

  return delta;
}
