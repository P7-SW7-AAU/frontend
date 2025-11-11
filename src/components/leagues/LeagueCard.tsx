"use client";

import React from 'react';
import { Trophy, Users, Crown, Edit2, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { League, Team } from '@/types';

type LeagueCardProps = {
  league: League;
  teams: Team[];
  currentUser: any;
  onEdit: () => void;
  onDelete: () => void;
  onViewLeague: (id: string) => void;
  onSelectTeam: () => void;
}

const LeagueCard = ({ league, teams, currentUser, onEdit, onDelete, onViewLeague, onSelectTeam }: LeagueCardProps) => {
  const isAdmin = league.commissionerId === currentUser.id;
  const selectedTeam = teams.find(team => team.leagueId === league.id)
    ? {
        id: teams.find(team => team.leagueId === league.id)!.id, // TODO: Pass this to SelectTeamModal to show the already selected team in the dropdown
        name: teams.find(team => team.leagueId === league.id)!.name,
        value: "$" + (teams.find(team => team.leagueId === league.id)!.roster.reduce((playerSum, player) => playerSum + player.price, 0) / 1_000_000).toFixed(1) + "M"
      }
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-xl text-white">{league.name}</CardTitle>
              {isAdmin && (
                <Crown className="h-5 w-5 text-primary-yellow" />
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-2 py-1">
                {league.counts.teams}/{league.maxTeams} Teams
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            {isAdmin && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {isAdmin && (
              <Button size="sm" variant="trash" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary-gray">Your Team</h4>
          <div className="space-y-2">
              <div className="flex items-center bg-[#0F141B] justify-between p-3 border-[1.5] rounded-lg border-yellow-500/40 shadow-[0_0_16px_rgba(255,215,0,0.35)]">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-white">{selectedTeam?.name || "No Team Selected"}</span>
                </div>
                <div className="text-lg font-semibold text-primary-yellow">
                  {selectedTeam?.value}
                </div>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1E2938]">
          <div className="space-y-1">
            <div className="text-sm font-medium text-primary-gray">Created</div>
            <div className="text-sm font-medium text-white">
                {league.createdAt ? new Date(league.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-primary-gray">Owner</div>
            <div className="text-sm font-medium text-white">
              {league.commissioner.displayName
                ? league.commissioner.displayName
                    .split("@")[0]
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                : "Anonymous"}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <Button 
            variant="hero" 
            className="flex-1"
            onClick={() => onViewLeague(league.id)}
          >
            <Trophy className="h-4 w-4 mr-2" />
            View League
          </Button>
          <Button variant="outline" className="flex-1" onClick={onSelectTeam}>
            <Users className="h-4 w-4 mr-2" />
            Select Team
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LeagueCard;
