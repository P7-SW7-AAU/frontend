"use client";

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Plus, Users, Trophy, Target, Trash2, Calendar, Edit2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Navbar from '@/components/Navbar';

import { getUserTeams, getCurrentUser, MAX_PLAYERS_PER_TEAM } from '@/data/multiSportMockData';

import { useCreateTeamModal } from '@/hooks/useCreateTeamModal';
import { useDeleteTeamModal } from "@/hooks/useDeleteTeamModal";
import { useEditTeamModal } from "@/hooks/useEditTeamModal";
import CardStats from '@/components/CardStats';
import CardAction from '@/components/CardAction';

const TeamsClient = () => {
  const currentUser = getCurrentUser();
  const userTeams = getUserTeams(currentUser.uniqueID);
  const createTeamModal = useCreateTeamModal();
  const deleteTeamModal = useDeleteTeamModal();
  const editTeamModal = useEditTeamModal();
  const router = useRouter();

  const handleViewTeam = (teamID: string) => {
    router.push(`/teams/lineup?team=${teamID}`);
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
      {/* TODO: Maybe remove max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">My Teams</h1>
            <p className="text-primary-gray font-medium mt-1">
              Manage your multi-sport fantasy teams
            </p>
          </div>
          <Button onClick={createTeamModal.onOpen} variant="hero" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Team
          </Button>
        </div>

        {/* Team Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CardStats 
            title="Total Teams" 
            value={userTeams.length} 
            valueColor="text-white" 
            description="active teams" 
            icon={Users} 
            iconColor="text-primary-green" 
          />

          <CardStats 
            title="Total Players" 
            value={userTeams.reduce((sum, team) => sum + team.playerCount, 0)} 
            valueColor="text-primary-green" 
            description="across all teams" 
            icon={Target} 
            iconColor="text-primary-green" 
          />

          <CardStats 
            title="Total Value" 
            value={`$${userTeams.reduce((sum, team) => sum + team.valueSum, 0).toFixed(1)}M`} 
            valueColor="text-primary-yellow" 
            description="combined value" 
            icon={Trophy} 
            iconColor="text-primary-yellow" 
          />

          <CardStats 
            title="Sports Covered" 
            value={5} 
            valueColor="text-white" 
            description="different sports" 
            icon={Calendar} 
            iconColor="text-primary-gray" 
          />
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
                            variant="secondary"
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
                        <Button size="sm" variant="outline" onClick={editTeamModal.onOpen}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="trash" onClick={deleteTeamModal.onOpen}>
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
                      <Button variant="outline" className="flex-1" onClick={() => router.push('/leagues')}>
                        <Trophy className="h-4 w-4 mr-2" />
                        View Leagues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Create New Team Card */}
            <CardAction 
              title="Create New Team"
              description="Build another multi-sport fantasy team with players from different sports"
              onClick={createTeamModal.onOpen}
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

export default TeamsClient;
