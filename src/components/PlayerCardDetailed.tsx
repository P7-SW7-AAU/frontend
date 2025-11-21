"use client";

import { usePathname } from 'next/navigation';
import { Lock, UserPlus, UserMinus, TrendingUp, TrendingDown, Minus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { usePlayerDelta } from '@/hooks/usePlayerDelta';

import { Player } from '@/types';

interface PlayerCardDetailedProps {
  player: Player;
  isOwned: boolean;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
  isLocked?: boolean;
}

const fmtMoney = (n: number, decimals = 0) => {
  // Always show all decimals, but omit trailing zeros
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n);
  if (decimals > 0) {
    // Remove trailing zeros after decimal, but keep at least one decimal if present
    // $1.2300 -> $1.23, $1.200 -> $1.2, $1.000 -> $1
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
  const pathname = usePathname();
  // Always call the hook, but only use its value when needed
  const delta = usePlayerDelta((player.sport || '').toLowerCase() as 'football' | 'nba' | 'f1', player.id);
  console.debug('[UI] delta', { name: player.name, sport: player.sport, id: player.id, delta });
  let newWeekPriceChange: number;
  let newPrice: number;
  if (pathname.includes('/teams')) {
    newWeekPriceChange = player.weekPriceChange;
    newPrice = player.price + newWeekPriceChange;
  } else {
    newWeekPriceChange = delta?.liveDelta != null ? delta.liveDelta : player.weekPriceChange;
    newPrice = player.price + newWeekPriceChange;
  }

  const getTrendIcon = (weeklyPriceChange: number) => {
    if (weeklyPriceChange > 0) return <TrendingUp className="h-3 w-3 text-primary-green" />;
    if (weeklyPriceChange < 0) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-primary-gray" />;
  }

  return (
    <div className="border-2 border-[#1E2938] hover:border-[#16A149] transition-all hover:-translate-y-1 group rounded-2xl bg-card">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 group-hover:scale-110 transition-transform">
              {player.logo ? (
                <img src={player.logo} alt={`${player.teamName} logo`} className="h-full w-full object-contain" />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
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
            {getTrendIcon(newWeekPriceChange)}
          </div>
        </div>

        <div className="space-y-2 mb-4 bg-[#131C25] rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Team</span>
            <span className="font-bold text-white text-xs">{player.teamName || "No Team"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Value</span>
            <span className="font-bold text-primary-yellow">{fmtMoney(newPrice / 1000000, 6).replace(/\.00$/, '')}M</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-gray font-medium">Weekly Price Change</span>
            <span className={`font-bold ${newWeekPriceChange > 0 ? 'text-primary-green' : newWeekPriceChange < 0 ? 'text-primary-red' : 'text-primary-gray'}`}> 
              {(() => {
                if (newWeekPriceChange === 0) return '—';
                const value = newWeekPriceChange / 1000;
                // Show three decimals for k-suffix
                const sign = newWeekPriceChange > 0 ? '+' : '';
                return `${sign}${fmtMoney(value, 3)}K`;
              })()}
            </span>
          </div>
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
