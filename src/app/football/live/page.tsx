'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
// UI File to test webscoket connection to football namespace

// --- Config ---
// Point to your API origin (where the NestJS gateway runs).
// If the frontend and API are served from the same origin via a reverse proxy, you can keep this empty.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

// Socket.IO namespace from your Nest gateway: @WebSocketGateway({ namespace: '/ws/football' })
const NAMESPACE = '/ws/football';

// --- Types ---
interface PlayerDeltaMsg {
  playerId: number;
  liveDelta: number; // integer (week-only)
  previewPrice: number; // clamped price
}

// --- Hook: manage namespace connection and subscriptions ---
function useFootballWS() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [lastError, setLastError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setStatus('connecting');

    // Connect to the namespace directly, e.g. http(s)://API_BASE/ws/football
    const url = API_BASE ? `${API_BASE}${NAMESPACE}` : NAMESPACE;
    const s = io(url, {
      transports: ['websocket'],
      // If the gateway is mounted on a custom path, pass { path: '/socket.io' } here.
      // path: '/socket.io',
      withCredentials: true,
    });

    socketRef.current = s;

    s.on('connect', () => {
      setStatus('connected');
      setLastError(null);
    });
    s.on('connect_error', (err) => {
      setStatus('disconnected');
      setLastError(err?.message || 'connect_error');
    });
    s.on('disconnect', () => {
      setStatus('disconnected');
    });

    return () => {
      s.close();
      socketRef.current = null;
    };
  }, []);

  const subscribePlayer = (playerId: number) => {
    const s = socketRef.current;
    if (!s || !s.connected) return;
    s.emit('subscribe', { type: 'player', playerId });
  };

  const onPlayerDelta = (handler: (msg: PlayerDeltaMsg) => void) => {
    const s = socketRef.current;
    if (!s) return () => {};
    s.on('playerWeekDelta', handler);
    return () => s.off('playerWeekDelta', handler);
  };

  return { socket: socketRef.current, status, lastError, subscribePlayer, onPlayerDelta };
}

// --- Utility formatters ---
const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function Badge({ color, children }: { color: 'green' | 'red' | 'gray'; children: React.ReactNode }) {
  const map: Record<string, string> = {
    green: 'bg-green-100 text-green-800 ring-green-200',
    red: 'bg-red-100 text-red-800 ring-red-200',
    gray: 'bg-gray-100 text-gray-800 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-2xl px-3 py-1 text-xs font-medium ring-1 ${map[color]}`}>
      {children}
    </span>
  );
}

// --- Page ---
export default function FootballLive() {
  const { status, lastError, subscribePlayer, onPlayerDelta } = useFootballWS();
  const [inputId, setInputId] = useState('');
  const [players, setPlayers] = useState<Record<number, PlayerDeltaMsg>>({});

  // subscribe to server events
  useEffect(() => {
    const off = onPlayerDelta((msg) => {
      setPlayers((old) => ({ ...old, [msg.playerId]: msg }));
    });
    return off;
  }, [onPlayerDelta]);

  const handleSubscribe = () => {
    const id = Number(inputId);
    if (!Number.isFinite(id)) return;
    subscribePlayer(id);
    setInputId('');
  };

  const statusBadge = useMemo(() => {
    if (status === 'connected') return <Badge color="green">connected</Badge>;
    if (status === 'connecting') return <Badge color="gray">connecting…</Badge>;
    return <Badge color="red">disconnected</Badge>;
  }, [status]);

  const rows = Object.values(players).sort((a, b) => a.playerId - b.playerId);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Football • Live Deltas</h1>
        <div className="flex items-center gap-2">
          {statusBadge}
          {lastError && <span className="text-xs text-red-600">{lastError}</span>}
        </div>
      </header>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Player ID</label>
            <input
              inputMode="numeric"
              className="w-48 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 12345"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubscribe}
            disabled={!inputId || status !== 'connected'}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Subscribe
          </button>
          <p className="text-xs text-gray-500">Use <code>POST /football/test-event</code> to simulate an update.</p>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-0 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Player ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Live Delta</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preview Price</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">No subscriptions yet.</td>
              </tr>
            ) : (
              rows.map((r) => {
                const deltaColor = r.liveDelta > 0 ? 'text-green-700' : r.liveDelta < 0 ? 'text-red-700' : 'text-gray-700';
                return (
                  <tr key={r.playerId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-sm">{r.playerId}</td>
                    <td className={`px-4 py-2 font-medium ${deltaColor}`}>{r.liveDelta.toLocaleString()}</td>
                    <td className="px-4 py-2">{fmtMoney(r.previewPrice)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <footer className="text-xs text-gray-500">
        Make sure <code>NEXT_PUBLIC_API_BASE</code> points to your API host (if different origin). The Nest gateway
        namespace is <code>{NAMESPACE}</code>.
      </footer>
    </div>
  );
}
