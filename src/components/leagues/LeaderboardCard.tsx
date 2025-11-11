import { Card, CardContent } from "@/components/ui/card";
import { Team } from "@/types";
import { Crown } from "lucide-react";

interface LeaderboardCardProps {
  team: Team;
  index: number;
  adminId: string | undefined;
  myTeam: Team | null;
}

const LeaderboardCard = ({ team, index, adminId, myTeam }: LeaderboardCardProps) => {
  const isMyTeam = myTeam && team.id === myTeam.id;
  
  return (
    <Card className={isMyTeam ? "border-yellow-500/40 shadow-[0_0_24px_rgba(255,215,0,0.35)]" : undefined}>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-extrabold text-black bg-primary-yellow">
              {index + 1}
            </div>
            <div className="min-w-0">
              <h3 className="truncate sm:text-xl font-bold text-white leading-tight">
                {team.name}
              </h3>
                <p className="text-xs sm:text-sm font-medium text-primary-gray truncate flex items-center gap-1">
                  Managed by {team.ownerDisplayName
                              .split("@")[0]
                              .split(/[ .]/)
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                  {adminId === team.ownerId && <Crown className="inline w-4 h-4 text-primary-yellow ml-1" />}
                </p>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 text-right">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary-yellow">
                {(() => {
                  const value = team.roster.map(player => player.price).reduce((acc, price) => acc + price, 0) / 1_000_000;
                  // Remove trailing zeros but keep up to 6 decimals, add thousand separators
                  let formatted = value.toFixed(6).replace(/\.?0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
                  // Add thousand separators
                  if (formatted.includes('.')) {
                      const [intPart, decPart] = formatted.split('.');
                      formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decPart;
                  } else {
                      formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }
                  return `$${formatted}M`;
              })()}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-primary-gray">Total Value</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold">
                {(() => {
                  const totalChange = team.roster.map(player => player.weekPriceChange).reduce((acc, price) => acc + price, 0);
                  const color = totalChange > 0 ? 'text-primary-green' : totalChange < 0 ? 'text-primary-red' : 'text-primary-gray';
                  return (
                      <div className={`text-lg font-semibold ${color}`}>
                          {totalChange === 0 ? '—' : (() => {
                              const value = totalChange / 1_000;
                              // Remove trailing zeros but keep up to 3 decimals, add thousand separators
                              let formatted = value.toFixed(3).replace(/\.?0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
                              if (formatted.includes('.')) {
                                  const [intPart, decPart] = formatted.split('.');
                                  formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decPart;
                              } else {
                                  formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                              }
                              return `${totalChange > 0 ? '+' : ''}$${formatted}K`;
                          })()}
                      </div>
                  );
              })()}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-primary-gray">This Week</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LeaderboardCard;
