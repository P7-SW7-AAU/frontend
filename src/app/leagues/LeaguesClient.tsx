"use client";

import { useRouter } from "next/navigation";
import { Plus, Users, Trophy, Target, Crown, Edit2, Trash2 } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardAction from '@/components/CardAction';
import CardStats from '@/components/CardStats';

import { 
  getCurrentUser, 
  leagues, 
  teamLeagues, 
  getUserTeams,
  getLeagueById,
  getLeagueStandings 
} from '@/data/multiSportMockData';

import { useCreateLeagueModal } from "@/hooks/useCreateLeagueModal";
import { useDeleteLeagueModal } from '@/hooks/useDeleteLeagueModal';
import { useEditLeagueModal } from "@/hooks/useEditLeagueModal";
import { useJoinLeagueModal } from "@/hooks/useJoinLeagueModal";

const LeaguesClient = () => {
  const currentUser = getCurrentUser();
  const userTeams = getUserTeams(currentUser.uniqueID);
  const router = useRouter();
  
  const createLeagueModal = useCreateLeagueModal();
  const deleteLeagueModal = useDeleteLeagueModal();
  const editLeagueModal = useEditLeagueModal();
  const joinLeagueModal = useJoinLeagueModal();

  // Get all leagues the user participates in
  const getUserLeagues = () => {
    const userTeamIds = userTeams.map(team => team.uniqueID);
    const userLeagueIds = teamLeagues
      .filter(tl => userTeamIds.includes(tl.team_ID) && tl.isActive)
      .map(tl => tl.league_ID);
    
    return leagues
      .filter(league => userLeagueIds.includes(league.uniqueID))
      .map(league => {
        const leagueData = getLeagueById(league.uniqueID);
        const standings = getLeagueStandings(league.uniqueID);
        const userTeamsInLeague = userTeams.filter(team => 
          teamLeagues.some(tl => 
            tl.team_ID === team.uniqueID && 
            tl.league_ID === league.uniqueID && 
            tl.isActive
          )
        );
        
        return {
          ...league,
          standings,
          userTeamsInLeague,
          totalTeams: leagueData?.teams.length || 0,
          isAdmin: league.admin_ID === currentUser.uniqueID
        };
      });
  };

  const userLeagues = getUserLeagues();

  const getLeagueStats = () => {
    const totalLeagues = userLeagues.length;
    const adminCount = userLeagues.filter(l => l.isAdmin).length;
    const totalTeamsInLeagues = userLeagues.reduce((sum, league) => {
      return sum + league.userTeamsInLeague.length;
    }, 0);
    const bestRanking = Math.min(...userLeagues.flatMap(league => 
      league.userTeamsInLeague.map(team => {
        const standing = league.standings.find(s => s.uniqueID === team.uniqueID);
        return standing?.ranking || 999;
      })
    ));

    return { totalLeagues, adminCount, totalTeamsInLeagues, bestRanking };
  };

  const stats = getLeagueStats();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">My Leagues</h1>
            <p className="text-primary-gray font-medium mt-1">
              Manage your league participation and track your performance
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="lg" onClick={joinLeagueModal.onOpen}>
              <Trophy className="h-4 w-4 mr-2" />
              Join League
            </Button>
            <Button onClick={createLeagueModal.onOpen} variant="hero" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create League
            </Button>
          </div>
        </div>

        {/* League Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardStats 
            title="Total Leagues" 
            value={stats.totalLeagues} 
            valueColor="text-white" 
            description="active leagues" 
            icon={Trophy} 
            iconColor="text-primary-green" 
          />

          <CardStats 
            title="Admin of" 
            value={stats.adminCount} 
            valueColor="text-primary-yellow" 
            description="leagues managed" 
            icon={Crown} 
            iconColor="text-primary-yellow" 
          />

          <CardStats 
            title="Teams Active" 
            value={stats.totalTeamsInLeagues} 
            valueColor="text-primary-green" 
            description="across leagues" 
            icon={Users} 
            iconColor="text-primary-green" 
          />

          <CardStats 
            title="Best Rank" 
            value={stats.bestRanking === 999 ? 'N/A' : `#${stats.bestRanking}`} 
            valueColor="text-white" 
            description="highest position" 
            icon={Target} 
            iconColor="text-primary-gray" 
          />
        </div>

        {/* Leagues Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Your Leagues</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userLeagues.map((league) => (
              <Card key={league.uniqueID} className="hover:shadow-card transition-smooth">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-xl text-white">{league.name}</CardTitle>
                        {league.isAdmin && (
                          <Crown className="h-5 w-5 text-primary-yellow" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant="secondary"
                          className="px-2 py-1"
                        >
                          {league.type}
                        </Badge>
                        <Badge variant="outline" className="px-2 py-1">
                          {league.totalTeams}/{league.maxTeams} Teams
                        </Badge>
                        <Badge variant="outline" className="px-2 py-1 capitalize">
                          {league.sportType}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {league.isAdmin && (
                        <Button size="sm" variant="outline" onClick={editLeagueModal.onOpen}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {league.isAdmin && (
                        <Button size="sm" variant="trash" onClick={deleteLeagueModal.onOpen}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Your Teams in This League */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-primary-gray">Your Teams</h4>
                    <div className="space-y-2">
                      {league.userTeamsInLeague.map((team) => {
                        const standing = league.standings.find(s => s.uniqueID === team.uniqueID);
                        return (
                          <div key={team.uniqueID} className="flex items-center justify-between p-2 bg-primary-yellow rounded-md">
                            <div className="flex items-center space-x-3">
                              <Badge 
                                variant="secondary"
                                className="px-2 py-1"
                              >
                                #{standing?.ranking || 'N/A'}
                              </Badge>
                              <span className="font-semibold text-black">{team.name}</span>
                            </div>
                            <div className="text-sm font-semibold text-black">
                              {standing?.totalPoints.toLocaleString() || 0} pts
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* League Info */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1E2938]">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-primary-gray">Created</div>
                      <div className="text-sm font-medium text-white">
                        {league.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-primary-gray">Sports</div>
                      <div className="text-sm font-medium text-white">
                        {league.allowedSports?.length || 0} allowed
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <Button 
                      variant="hero" 
                      className="flex-1"
                      onClick={() => router.push(`/leagues/${league.uniqueID}`)} // TODO: Change to ${leagueId}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      View League
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Change Teams
                      {/* TODO: Implement change teams functionality and modal */}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Join/Create League Cards */}
            <CardAction 
              title="Join League"
              description="Enter a league code to join an existing league with your teams"
              onClick={joinLeagueModal.onOpen}
              icon={Trophy}
              iconColor="text-primary-yellow"
              iconBgColor="bg-[#2A2A23]"
              hoverColor="hover:border-[#846F2F]"
            />

            <CardAction 
              title="Create League"
              description="Start your own multi-sport fantasy league and invite friends"
              onClick={createLeagueModal.onOpen}
              icon={Plus}
              iconColor="text-primary-green"
              iconBgColor="bg-[#152624]"
              hoverColor="hover:border-[#1D5D36]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaguesClient;
