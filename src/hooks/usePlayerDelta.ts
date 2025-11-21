'use client';

import { useEffect, useRef, useState } from 'react';
import { Manager, Socket } from 'socket.io-client';

type Sport = 'football' | 'nba' | 'f1';

type RawDeltaMsg = {
  playerId?: number;
  driverId?: number;
  liveDelta: number;
  previewPrice: number;
};

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

// One Manager per baseUrl
const managerCache = new Map<string, Manager>();

function getManager(baseUrl: string): Manager {
  let m = managerCache.get(baseUrl);
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
    managerCache.set(baseUrl, m);
  }
  return m;
}

// One socket per (baseUrl + namespace)
const socketCache = new Map<string, Socket>();

function getSocket(baseUrl: string, namespace: string): Socket {
  const key = `${baseUrl}${namespace}`;
  let sock = socketCache.get(key);
  if (!sock) {
    const manager = getManager(baseUrl);
    sock = manager.socket(namespace);
    socketCache.set(key, sock);
  }
  return sock;
}

export function usePlayerDelta(sport: Sport, entityId: number) {
  const [delta, setDelta] = useState<DeltaMsg | null>(null);
  const sockRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!Number.isFinite(entityId)) return;

    const namespace = nsFor(sport);
    const evt = eventFor(sport);
    const base = API_BASE || window.location.origin;

    const socket = getSocket(base, namespace);
    sockRef.current = socket;

    const onConnect = () => {
      console.debug('[WS] connect', { ns: namespace, id: socket.id });

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
        setDelta({
          id,
          liveDelta: msg.liveDelta,
          previewPrice: msg.previewPrice,
        });
      }
    };

    // Use unknown instead of any
    const onAny = (event: string, ...args: unknown[]) => {
      console.debug('[WS] onAny', { ns: namespace, event, args });
    };

    const onConnectError = (e: Error) => {
      console.error('[WS] connect_error', { ns: namespace, error: e.message });
    };

    const onError = (e: Error) => {
      console.error('[WS] error', { ns: namespace, error: e.message });
    };

    socket.on('connect', onConnect);
    socket.on(evt, onMsg);
    socket.onAny(onAny);
    socket.on('connect_error', onConnectError);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off(evt, onMsg);
      socket.offAny(onAny);
      socket.off('connect_error', onConnectError);
      socket.off('error', onError);

      sockRef.current = null;
    };
  }, [sport, entityId]);

  return delta;
}
