"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, UserPlus, UserMinus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Player } from '@/types';
import { usePlayerDelta } from '@/hooks/usePlayerDelta';
import React from 'react';

interface PlayerCardDetailedProps {
  player: Player; // ensure player.sport is 'football' | 'nba'
  isOwned: boolean;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
  isLocked?: boolean;
}


const fmtMoney = (n: number, decimals = 0) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n);
  // Remove trailing zeros after decimal if all are zero
  if (decimals > 0) {
    // e.g. $1.00 -> $1, $1.10 -> $1.1, $1.01 -> $1.01
    return formatted.replace(/(\.\d*?[1-9])0+$/,'$1').replace(/\.0+$/,'');
  }
  return formatted;
};

const PlayerCardDetailed = ({
  player,
  isOwned,
  onAdd,
  onRemove,
  disabled,
  isLocked,
}: PlayerCardDetailedProps) => {
  // sport-aware
  const delta = usePlayerDelta((player.sport || '').toLowerCase() as 'football' | 'nba', player.id);

  const changeColor =
    delta?.liveDelta == null ? 'text-primary-gray' : delta.liveDelta >= 0 ? 'text-green-400' : 'text-red-400';

  const getTrendIcon = (weeklyPriceChange: number) => {
    if (weeklyPriceChange > 0) return <TrendingUp className="h-3 w-3 text-primary-green" />;
    if (weeklyPriceChange < 0) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-primary-gray" />;
  }

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
            {getTrendIcon(player.weekPriceChange)}
            <Badge variant="secondary" className="text-xs font-bold">
              {fmtMoney(player.price / 1000000, 2).replace(/\.00$/, '')}M
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4 bg-[#131C25] rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Team</span>
            <span className="font-bold text-white text-xs">{player.sportsTeam || "Name"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Value</span>
            <span className="font-bold text-primary-yellow">{fmtMoney(player.price / 1000000, 2).replace(/\.00$/, '')}M</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Weekly Price Change</span>
            <span className={`font-bold ${player.weekPriceChange > 0 ? 'text-primary-green' : player.weekPriceChange < 0 ? 'text-primary-red' : 'text-primary-gray'}`}> 
              {(() => {
                if (player.weekPriceChange === 0) return '—';
                const value = player.weekPriceChange / 1000;
                // Show three decimals for k-suffix
                const sign = player.weekPriceChange > 0 ? '+' : '';
                return `${sign}${fmtMoney(value, 3)}K`;
              })()}
            </span>
          </div>

          {/* Live change (from WS) */}
          {/* <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Live change</span>
            <span className={`font-bold ${changeColor}`}>
              {delta?.liveDelta == null ? '—' : `${delta.liveDelta >= 0 ? '+' : ''}${fmtMoney(delta.liveDelta)}`}
            </span>
          </div> */}

          {/* show preview price if present */}
          {delta?.previewPrice != null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-gray font-medium">Preview price</span>
              <span className="font-bold text-white">{fmtMoney(delta.previewPrice)}</span>
            </div>
          )}
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
}

export default PlayerCardDetailed;
