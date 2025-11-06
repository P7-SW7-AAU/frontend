"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, UserPlus, UserMinus } from 'lucide-react';
import { Player } from '@/types';
import { usePlayerDelta } from '@/hooks/usePlayerDelta';
import React from 'react';

interface PlayerCardDetailedProps {
  player: Player; // ensure player.sport is 'football' | 'nba'
  isOwned: boolean;
  onAdd: () => void;
  onRemove: () => void;
  getTrendIcon: (trend?: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  disabled?: boolean;
  isLocked?: boolean;
}

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const PlayerCardDetailed = ({
  player,
  isOwned,
  onAdd,
  onRemove,
  getTrendIcon,
  getStatusColor,
  disabled,
  isLocked,
}: PlayerCardDetailedProps) => {
  // sport-aware
  const delta = usePlayerDelta((player.sport || '').toLowerCase() as 'football' | 'nba', player.id);


  const changeColor =
    delta?.liveDelta == null ? 'text-primary-gray' : delta.liveDelta >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="hover:shadow-elegant border border-[#1E2938] hover:border-[#16A149] transition-all hover:-translate-y-1 group rounded-xl bg-card">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 group-hover:scale-110 transition-transform">
              <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold">
                {player.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{player.name}</h3>
              <p className="text-sm text-primary-gray font-medium">
                {player.sport.charAt(0).toUpperCase() + player.sport.slice(1).toLowerCase()}
              </p>
            </div>
          </div>

          {isLocked && (
            <div className="flex items-center gap-1 text-xs text-primary-gray ml-2">
              <Lock className="h-4 w-4 text-primary-yellow" />
              <span className="font-semibold text-primary-yellow">Locked</span>
            </div>
          )}

          <div className="flex flex-col items-end gap-1">
            {getTrendIcon(player.trend)}
            <Badge variant="secondary" className="text-xs font-bold">
              ${player.value ?? 100}M
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4 bg-[#131C25] rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Team</span>
            <span className="font-bold text-white text-xs">{player.sportsTeam || "unknown"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Value</span>
            <span className="font-bold text-white">${player.value}M</span>
          </div>

          {/* Live change (from WS) */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Live change</span>
            <span className={`font-bold ${changeColor}`}>
              {delta?.liveDelta == null ? '—' : `${delta.liveDelta >= 0 ? '+' : ''}${fmtMoney(delta.liveDelta)}`}
            </span>
          </div>

          {/* show preview price if present */}
          {delta?.previewPrice != null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-gray font-medium">Preview price</span>
              <span className="font-bold text-white">{fmtMoney(delta.previewPrice)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Points</span>
            <span className="font-bold text-primary-green">{player.points ?? "50"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Projected</span>
            <span className="font-bold text-white">{player.projectedPoints ?? "60"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant={
              player.status
                ? (getStatusColor(player.status) as "default" | "destructive" | "outline" | "secondary" | undefined)
                : "default"
            }
            className="text-xs font-bold"
          >
            {player.status ? player.status.toUpperCase() : "ACTIVE"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {player.popularity ?? 0}% owned
          </Badge>
        </div>

        {isOwned ? (
          <Button className="w-full hover:scale-105 transition-transform" size="sm" variant="destructive" onClick={onRemove} disabled={isLocked}>
            <UserMinus className="h-4 w-4 mr-2" />
            Remove from Team
          </Button>
        ) : (
          <Button className="w-full hover:scale-105 transition-transform" size="sm" variant="hero" onClick={onAdd} disabled={disabled || isLocked}>
            <UserPlus className="h-4 w-4 mr-2" />
            {disabled ? 'Unavailable' : 'Add Player'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlayerCardDetailed;