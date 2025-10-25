"use client";

import React from 'react';
import { Trophy, Users, Crown, Edit2, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type League = any;

type Props = {
  league: League;
  onEdit: () => void;
  onDelete: () => void;
  onViewLeague: (id: string) => void;
  onSelectTeam: () => void;
}

const LeagueCard: React.FC<Props> = ({ league, onEdit, onDelete, onViewLeague, onSelectTeam }) => {
  return (
    <Card>
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
              <Badge variant="secondary" className="px-2 py-1">
                {league.totalTeams}/{league.maxTeams} Teams
              </Badge>
              <Badge variant="outline" className="px-2 py-1 capitalize">
                {league.sportType}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            {league.isAdmin && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {league.isAdmin && (
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
            {league.userTeamsInLeague.map((team: any) => {
              const standing = league.standings.find((s: any) => s.uniqueID === team.uniqueID);
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

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1E2938]">
          <div className="space-y-1">
            <div className="text-sm font-medium text-primary-gray">Created</div>
            <div className="text-sm font-medium text-white">
              {league.createdAt?.toLocaleDateString?.()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-primary-gray">Sports</div>
            <div className="text-sm font-medium text-white">
              {league.allowedSports?.length || 0} allowed
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <Button 
            variant="hero" 
            className="flex-1"
            onClick={() => onViewLeague(league.uniqueID)}
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
