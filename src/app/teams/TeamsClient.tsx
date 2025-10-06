"use client";

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Trophy, Target, Trash2, Calendar, Edit2 } from 'lucide-react';
import { getUserTeams, getCurrentUser, MAX_PLAYERS_PER_TEAM } from '@/data/multiSportMockData';
import { useRouter } from 'next/navigation';

const TeamsClient = () => {
  const currentUser = getCurrentUser();
  const userTeams = getUserTeams(currentUser.uniqueID);
  const router = useRouter();

  const handleCreateTeam = () => {
    // TODO: Implement team creation logic
  };

  const handleViewTeam = (teamID: string) => {
    router.push(`/teams/lineup`);
  };

  const getTeamStats = (team: any) => {
    const totalPoints = team.players.reduce((sum: number, player: any) => sum + (player.points || 0), 0);
    const projectedPoints = team.players.reduce((sum: number, player: any) => sum + (player.projectedPoints || 0), 0);
    
    // Group players by sport
    const sportGroups = team.players.reduce((groups: any, player: any) => {
      const sportName = player.sportsTeam?.sports_League_ID?.includes('nfl') ? 'Football' :
                        player.sportsTeam?.sports_League_ID?.includes('nba') ? 'Basketball' :
                        player.sportsTeam?.sports_League_ID?.includes('epl') ? 'Soccer' :
                        player.sportsTeam?.sports_League_ID?.includes('chess') ? 'Chess' : 'Tennis';
      
      if (!groups[sportName]) groups[sportName] = 0;
      groups[sportName]++;
      return groups;
    }, {});

    return { totalPoints, projectedPoints, sportGroups };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">My Teams</h1>
            <p className="text-primary-gray font-medium mt-1">
              Manage your multi-sport fantasy teams
            </p>
          </div>
          <Button onClick={handleCreateTeam} variant="hero" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Team
          </Button>
        </div>

        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary-gray flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary-green" />
                Total Teams
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">{userTeams.length}</div>
              <p className="text-sm font-medium text-primary-gray">active teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary-gray flex items-center">
                <Target className="h-4 w-4 mr-2 text-primary-green" />
                Total Players
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary-green">
                {userTeams.reduce((sum, team) => sum + team.playerCount, 0)}
              </div>
              <p className="text-sm font-medium text-primary-gray">across all teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary-gray flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-primary-yellow" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary-yellow">
                ${userTeams.reduce((sum, team) => sum + team.valueSum, 0).toFixed(1)}M
              </div>
              <p className="text-sm font-medium text-primary-gray">combined value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary-gray flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary-gray" />
                Sports Covered
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">5</div>
              <p className="text-sm font-medium text-primary-gray">different sports</p>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Your Teams</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userTeams.map((team) => {
              const stats = getTeamStats(team);
              return (
                <Card key={team.uniqueID} className="hover:shadow-card transition-smooth">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-xl text-white">{team.name}</CardTitle>
                        <div className="flex items-center space-x-4">
                          <Badge 
                            variant={team.playerCount === MAX_PLAYERS_PER_TEAM ? "default" : "secondary"}
                            className="px-2 py-1"
                          >
                            {team.playerCount}/{MAX_PLAYERS_PER_TEAM} Players
                          </Badge>
                          <Badge variant="outline" className="px-2 py-1">
                            ${team.valueSum}M Value
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="trash">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Sports Breakdown */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-primary-gray">Sports Breakdown</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(stats.sportGroups).map(([sport, count]) => (
                          <Badge key={sport} variant="secondary">
                            {sport}: {count as number}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-primary-gray">Total Points</div>
                        <div className="text-lg font-semibold text-white">
                          {stats.totalPoints.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-primary-gray">Projected</div>
                        <div className="text-lg font-semibold text-primary-green">
                          {stats.projectedPoints.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <Button 
                        variant="hero" 
                        className="flex-1"
                        onClick={() => handleViewTeam(team.uniqueID)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Manage Team
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Trophy className="h-4 w-4 mr-2" />
                        View Leagues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Create New Team Card */}
            <Card className="border-dashed border-2 hover:border-[#1D5D36] transition-colors cursor-pointer" onClick={handleCreateTeam}>
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-[#152624] p-6">
                  <Plus className="h-8 w-8 text-primary-green" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-white">Create New Team</h3>
                  <p className="text-sm font-medium text-primary-gray max-w-xs">
                    Build another multi-sport fantasy team with players from different sports
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsClient;
