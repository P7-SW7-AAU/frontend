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

// Manager cache
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

// Socket cache
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

    const doSubscribe = () => {
      if (sport === 'f1') {
        socket.emit('subscribe', { type: 'driver', driverId: entityId });
      } else {
        socket.emit('subscribe', { type: 'player', playerId: entityId });
      }
      console.debug('[WS] subscribe sent', { ns: namespace, entityId, sport });
    };

    const onConnect = () => {
      console.debug('[WS] connect', { ns: namespace, id: socket.id });
      doSubscribe();
    };

    const onMsg = (msg: RawDeltaMsg) => {
      const id = msg.playerId ?? msg.driverId;
      if (id === entityId) {
        console.debug('[WS] delta msg', msg);
        setDelta({
          id,
          liveDelta: msg.liveDelta,
          previewPrice: msg.previewPrice,
        });
      }
    };

    const onConnectError = (e: Error) => {
      console.error('[WS] connect_error', e);
    };

    const onError = (e: Error) => {
      console.error('[WS] error', e);
    };

    socket.on('connect', onConnect);
    socket.on(evt, onMsg);
    socket.on('connect_error', onConnectError);
    socket.on('error', onError);

    if (socket.connected) {
      doSubscribe();
    }

    return () => {
      if (sockRef.current) {
        if (sport === 'f1') {
          sockRef.current.emit('unsubscribe', { type: 'driver', driverId: entityId });
        } else {
          sockRef.current.emit('unsubscribe', { type: 'player', playerId: entityId });
        }
        console.debug('[WS] unsubscribe sent', { ns: namespace, entityId, sport });
      }

      socket.off('connect', onConnect);
      socket.off(evt, onMsg);
      socket.off('connect_error', onConnectError);
      socket.off('error', onError);

      sockRef.current = null;
    };
  }, [sport, entityId]);

  return delta;
}
