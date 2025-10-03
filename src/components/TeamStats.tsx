import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp, Users } from 'lucide-react';
import { TeamWithPlayers } from '@/types/database';

interface TeamStatsProps {
  team: TeamWithPlayers;
  ranking: number;
  totalTeams: number;
  totalPoints: number;
  weeklyPoints: number;
  projectedPoints: number;
}

const TeamStats = ({
  team,
  ranking,
  totalTeams,
  totalPoints,
  weeklyPoints,
  projectedPoints
}: TeamStatsProps) => {

  const stats = [
    {
      title: 'Total Points',
      value: totalPoints.toLocaleString(),
      icon: Target,
      color: 'text-[#16A149]'
    },
    {
      title: 'This Week',
      value: weeklyPoints.toString(),
      icon: TrendingUp,
      color: 'text-[#16A149]'
    },
    {
      title: 'League Rank',
      value: `${ranking}/${totalTeams}`,
      icon: Trophy,
      color: ranking <= 3 ? 'text-[#F8C631]' : 'text-white'
    },
    {
      title: 'Players',
      value: `${team.playerCount}/10`,
      icon: Users,
      color: 'text-white'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">{team.name}</h1>
        <div className="text-sm font-medium text-[#94A4B8]">
          Managed by {team.user?.name} • Team Value: ${team.valueSum}M
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="px-3 py-1 bg-[#152332] font-bold">
            {team.players.length} Sports Represented
          </Badge>
          <Badge 
            variant={ranking <= 3 ? "default" : "outline"}
            className={`px-3 py-1 ${ranking <= 3 ? 'bg-[#F8C631] text-black font-bold' : 'bg-[#F8C631] text-black font-bold'}`}
          >
            #{ranking} in League
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-card transition-smooth">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[#94A4B8] flex items-center">
                  <Icon className={`h-4 w-4 mr-2 ${stat.color}`} />
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-dark border-border border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-[#16A149]" />
            Weekly Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#94A4B8] font-medium">Current Score</span>
              <span className="text-xl font-semibold text-white">{weeklyPoints}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94A4B8] font-medium">Projected Total</span>
              <span className="text-xl font-semibold text-[#16A149]">{projectedPoints}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-3">
              <div
                className="bg-[#16A149] h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((weeklyPoints / projectedPoints) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStats;
