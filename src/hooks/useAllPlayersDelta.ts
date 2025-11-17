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

// Cache sockets per sport (namespace)
const socketCache = new Map<string, Socket>();

/**
 * Subscribe to live price deltas for multiple entities (players/drivers) over a single socket per sport.
 * @param sport - The sport namespace
 * @param entityIds - Array of playerIds (football/nba) or driverIds (f1)
 * @returns Record<entityId, DeltaMsg>
 */
export function usePlayerDelta(sport: Sport, entityIds: number[]) {
  const [deltas, setDeltas] = useState<Record<number, DeltaMsg>>({});
  const prevIdsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!entityIds || entityIds.length === 0) return;

    const namespace = nsFor(sport);
    const evt = eventFor(sport);
    const base = API_BASE || window.location.origin;

    // Use a cached socket per sport namespace
    let socket = socketCache.get(namespace);
    if (!socket) {
      socket = API_BASE
        ? io(`${API_BASE}${namespace}`, {
            path: SOCKET_PATH,
            transports: ['websocket'],
            withCredentials: true,
            forceNew: true,
          })
        : getManager(base).socket(namespace);
      socketCache.set(namespace, socket);
    }

    // Subscribe to all entityIds
    const subscribeAll = () => {
      if (sport === 'f1') {
        socket.emit('subscribe', { type: 'driver', driverIds: entityIds });
      } else {
        socket.emit('subscribe', { type: 'player', playerIds: entityIds });
      }
      console.debug('[WS] subscribe sent', { ns: namespace, entityIds, sport });
    };

    // Unsubscribe previous IDs if changed
    const unsubscribePrev = () => {
      const prevIds = prevIdsRef.current;
      if (!prevIds.length) return;
      if (sport === 'f1') {
        socket.emit('unsubscribe', { type: 'driver', driverIds: prevIds });
      } else {
        socket.emit('unsubscribe', { type: 'player', playerIds: prevIds });
      }
      console.debug('[WS] unsubscribe sent', { ns: namespace, prevIds, sport });
    };

    const onConnect = () => {
      console.debug('[WS] connect', { ns: namespace, id: socket.id });
      subscribeAll();
    };

    const onMsg = (msg: RawDeltaMsg) => {
      const id = msg.playerId ?? msg.driverId;
      if (typeof id === 'number' && entityIds.includes(id)) {
        setDeltas(prev => ({ ...prev, [id]: { id, liveDelta: msg.liveDelta, previewPrice: msg.previewPrice } }));
      }
    };

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

    // Subscribe/unsubscribe on entityIds change
    unsubscribePrev();
    subscribeAll();
    prevIdsRef.current = entityIds;

    return () => {
      socket.off('connect', onConnect);
      socket.off(evt, onMsg);
      socket.offAny(onAny);
      socket.off('connect_error');
      socket.off('error');
      // Unsubscribe on cleanup
      if (entityIds.length) {
        if (sport === 'f1') {
          socket.emit('unsubscribe', { type: 'driver', driverIds: entityIds });
        } else {
          socket.emit('unsubscribe', { type: 'player', playerIds: entityIds });
        }
        console.debug('[WS] cleanup unsubscribe', { ns: namespace, entityIds, sport });
      }
      // Optionally disconnect socket if no more listeners (not done here for cache)
    };
  }, [sport, JSON.stringify(entityIds)]);

  return deltas;
}
