import { Crown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Team } from "@/types";

import { useTeamValueFormat } from "@/hooks/useValueFormat";

interface LeaderboardCardProps {
  team: Team;
  index: number;
  adminId: string | undefined;
  myTeam: Team | null;
}

const LeaderboardCard = ({ team, index, adminId, myTeam }: LeaderboardCardProps) => {
  const isMyTeam = myTeam && team.id === myTeam.id;
  const { totalValue, weeklyChange } = useTeamValueFormat(team);
  
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
                {totalValue()}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-primary-gray">Total Value</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold">
                <div className={`text-lg font-semibold ${weeklyChange().color}`}>
                  {weeklyChange().formatted}
                </div>
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
