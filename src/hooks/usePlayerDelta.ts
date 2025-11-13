'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Manager, Socket } from 'socket.io-client';

type Sport = 'football' | 'nba' | 'f1';

// Raw messages from servers (football/nba use playerId; f1 uses driverId)
type RawDeltaMsg = { playerId?: number; driverId?: number; liveDelta: number; previewPrice: number };

// Normalized shape your UI can use regardless of sport
type DeltaMsg = { id: number; liveDelta: number; previewPrice: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const SOCKET_PATH = '/socket.io';

function nsFor(sport: Sport) {
  if (sport === 'football') return '/ws/football';
  if (sport === 'nba') return '/ws/nba';
  return '/ws/f1';
}
function eventFor(sport: Sport) {
  if (sport === 'football') return 'playerWeekDelta';
  if (sport === 'nba') return 'playerGameDelta';
  return 'driverRaceDelta';
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

/**
 * Subscribe to live price deltas for a single entity:
 * - football: playerId
 * - nba:      playerId
 * - f1:       driverId
 */
export function usePlayerDelta(sport: Sport, entityId: number) {
  const [delta, setDelta] = useState<DeltaMsg | null>(null);
  const sockRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!Number.isFinite(entityId)) return;

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

      // Subscribe payload differs for F1 vs others
      if (sport === 'f1') {
        socket.emit('subscribe', { type: 'driver', driverId: entityId });
      } else {
        socket.emit('subscribe', { type: 'player', playerId: entityId });
      }

      console.debug('[WS] subscribe sent', { ns: namespace, entityId, sport });
    };

    const onMsg = (msg: RawDeltaMsg) => {
      console.debug('[WS] message', { ns: namespace, evt, msg });
      const id = msg.playerId ?? msg.driverId;
      if (id === entityId) {
        setDelta({ id, liveDelta: msg.liveDelta, previewPrice: msg.previewPrice });
      }
    };

    // log everything (handy while integrating)
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
  }, [sport, entityId]);

  return delta;
}
