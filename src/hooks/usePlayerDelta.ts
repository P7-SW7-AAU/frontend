// hooks/usePlayerDelta.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Manager, Socket } from 'socket.io-client';

type Sport = 'football' | 'nba';
type DeltaMsg = { playerId: number; liveDelta: number; previewPrice: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const SOCKET_PATH = '/socket.io';

function nsFor(sport: Sport) {
  return sport === 'football' ? '/ws/football' : '/ws/nba';
}
function eventFor(sport: Sport) {
  return sport === 'football' ? 'playerWeekDelta' : 'playerGameDelta';
}

const managerCache = new Map<string, Manager>();
function getManager(baseUrl: string) {
  const key = `${baseUrl}|${SOCKET_PATH}`;
  let m = managerCache.get(key);
  if (!m) {
    m = new Manager(baseUrl, {
      path: SOCKET_PATH,
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 800,
      autoConnect: true,
    });
    managerCache.set(key, m);
  }
  return m;
}

export function usePlayerDelta(sport: Sport, playerId: number) {
  const [delta, setDelta] = useState<DeltaMsg | null>(null);
  const sockRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!Number.isFinite(playerId)) return;

    const namespace = nsFor(sport);
    const evt = eventFor(sport);
    const base = API_BASE || window.location.origin;

    // Cross-origin? prefer full URL sockets (forceNew). Same-origin? use Manager.
    const socket: Socket = API_BASE
      ? io(`${API_BASE}${namespace}`, {
          path: SOCKET_PATH,
          transports: ['websocket'],
          withCredentials: true,
          forceNew: true,
        })
      : getManager(base).socket(namespace);

    sockRef.current = socket;

    const onConnect = () => {
      console.debug('[WS] connect', { ns: namespace, id: socket.id });
      socket.emit('subscribe', { type: 'player', playerId });
      console.debug('[WS] subscribe sent', { ns: namespace, playerId });
    };

    const onMsg = (msg: DeltaMsg) => {
      console.debug('[WS] message', { ns: namespace, evt, msg });
      if (msg?.playerId === playerId) setDelta(msg);
    };

    // log everything
    const onAny = (event: string, ...args: unknown[]) => {
      console.debug('[WS] onAny', { ns: namespace, event, args });
    };

    socket.on('connect', onConnect);
    socket.on(evt, onMsg);
    socket.onAny(onAny);
    socket.on('connect_error', (e) =>
      console.error('[WS] connect_error', { ns: namespace, error: e?.message ?? e })
    );
    socket.on('error', (e) => console.error('[WS] error', { ns: namespace, error: e }));

    // ensure namespace connects if Manager path
    if (!API_BASE) socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off(evt, onMsg);
      socket.offAny(onAny);
      socket.off('connect_error');
      socket.off('error');
      socket.disconnect();
      console.debug('[WS] cleanup', { ns: namespace });
      sockRef.current = null;
    };
  }, [sport, playerId]);

  return delta;
}
