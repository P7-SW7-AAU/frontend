import { Card, CardContent } from "@/components/ui/card";

interface CardLeaderboardProps {
  standings: any[]; // adapt to a concrete type when using real data
}

const CardLeaderboard = ({ standings }: CardLeaderboardProps) => {
  return (
    <div className="space-y-6">
      {standings.map((team, index) => {
        return (
          <Card
            key={team.uniqueID}
            className="bg-[#131920] shadow-lg rounded-2xl border-[#1E2938]"
          >
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                {/* Left: Rank and Team Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-extrabold text-black bg-primary-yellow shadow-md border-4 border-[#23272f] shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg sm:text-xl font-bold text-white leading-tight">
                      {team.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-primary-gray truncate">
                      Managed by {team.user?.name}
                    </p>
                    <p className="text-xs font-medium text-primary-gray mt-1">
                      Team Value: <span className="text-primary-green font-semibold">${team.valueSum}M</span>
                    </p>
                  </div>
                </div>
                {/* Right: Points */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 text-right">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow">
                      {team.totalPoints}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-primary-gray">Total Points</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-primary-green">
                      +{team.weeklyPoints}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-primary-gray">This Week</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default CardLeaderboard;
