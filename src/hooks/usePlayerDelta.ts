// hooks/usePlayerDelta.ts
'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const NAMESPACE = '/ws/football';

type DeltaMsg = { playerId: number; liveDelta: number; previewPrice: number };

export function usePlayerDelta(playerId: number) {
  const [delta, setDelta] = useState<DeltaMsg | null>(null);

  useEffect(() => {
    if (!Number.isFinite(playerId)) return; // don't connect with a bad id

    const url = API_BASE ? `${API_BASE}${NAMESPACE}` : NAMESPACE;
    const ws: Socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
      // path: '/socket.io', // uncomment if you mounted a custom path
    });

    const onConnect = () => {
      // subscribe ONLY after connected (matches your working page)
      ws.emit('subscribe', { type: 'player', playerId });
      // optional: console.debug('[usePlayerDelta] subscribed', playerId);
    };

    const onMsg = (msg: DeltaMsg) => {
      if (msg?.playerId === playerId) setDelta(msg);
    };

    ws.on('connect', onConnect);
    ws.on('playerWeekDelta', onMsg);

    return () => {
      ws.off('connect', onConnect);
      ws.off('playerWeekDelta', onMsg);
      ws.close();
    };
  }, [playerId]);

  return delta;
}
