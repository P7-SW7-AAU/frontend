"use client";

import React, { useMemo, useState } from 'react';
import { Trophy, Zap, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PlayerCardDetailed from '@/components/PlayerCardDetailed';
import { Player } from '@/types';

interface Props {
  players: Player[];
  draftedPlayers: Record<string, number[]>;
  selectedTeamId: string;
  selectedTeam?: any;
  handleDraftPlayer: (id: number, name: string) => void;
  handleUndraftPlayer: (id: number, name: string) => void;
  getRemainingBudget: (teamId: string) => number;
  getRemainingSlots: (teamId: string) => number;
  lockToken?: string;
}

const PlayersManagementCard = ({
  players,
  draftedPlayers,
  selectedTeamId,
  selectedTeam,
  handleDraftPlayer,
  handleUndraftPlayer,
  getRemainingBudget,
  getRemainingSlots,
  lockToken,
}: Props) => {
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sports = [
    { id: 'FOOTBALL', name: 'Football' },
    { id: 'F1', name: 'F1' },
    { id: 'NBA', name: 'NBA' },
  ]

  const isPlayerOnTeam = (playerId: number) => {
    return draftedPlayers[selectedTeamId]?.includes(playerId) || false;
  }

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (selectedSport !== 'all') {
        const sportPlayers = players.filter((p) => p.sport === selectedSport);
        if (!sportPlayers.some((sp) => sp.id === player.id)) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(query);
        const matchesTeam = player.teamName?.toLowerCase().includes(query);
        const matchesSport = player.sport.toLowerCase().includes(query);
        return matchesName || matchesTeam || matchesSport;
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  }, [players, selectedSport, searchQuery]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white text-2xl font-bold">
          <Zap className="h-6 w-6 text-primary-green" />
          Player Management
        </CardTitle>
        <CardDescription className="mt-1 text-primary-gray font-medium">
          Manage your team and find new talent
        </CardDescription>

        <div className="flex flex-col lg:flex-row gap-4 mb-6 mt-6">
          <div className="relative flex-1 bg-[#0F141B]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary-gray" />
            <Input
              placeholder="Search players, teams, sports..."
              className="pl-10 border-[#1E2938] text-white font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSport === 'all' ? 'hero' : 'outline'}
              size="sm"
              onClick={() => setSelectedSport('all')}
            >
              All Sports
            </Button>
            {sports.map((sport) => (
              <Button
                key={sport.id}
                variant={selectedSport === sport.id ? 'hero' : 'outline'}
                size="sm"
                onClick={() => setSelectedSport(sport.id)}
              >
                {sport.name}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'all' | 'my')} className="w-full">
          <TabsList className="grid w-full h-11 grid-cols-2 bg-[#152332]">
            <TabsTrigger value="all" className="text-white font-bold cursor-pointer">
              All Players ({filteredPlayers.length})
            </TabsTrigger>
            <TabsTrigger value="my" className="text-white font-bold cursor-pointer">
              My Players ({selectedTeamId ? (draftedPlayers[selectedTeamId]?.length || 0) : 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        {viewMode === 'all' ? (
          <>
            <p className="text-sm text-primary-gray font-medium mb-4">
              {filteredPlayers.length} players found
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlayers.map((player: Player) => {
                const isLocked = lockToken === player?.tradeLockedWeek;
                return (
                <PlayerCardDetailed
                  key={player.id}
                  player={player}
                  isOwned={isPlayerOnTeam(player.id)}
                  onAdd={() => handleDraftPlayer(player.id, player.name)}
                  onRemove={() => handleUndraftPlayer(player.id, player.name)}
                  isLocked={isLocked}
                  disabled={
                    !selectedTeamId ||
                    player.price > getRemainingBudget(selectedTeamId) ||
                    getRemainingSlots(selectedTeamId) <= 0
                  }
                />
              );
            })}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <Search className="h-16 w-16 mx-auto text-primary-gray mb-4" />
                <p className="text-primary-gray text-lg font-medium">No players found</p>
                <p className="text-sm text-primary-gray font-medium mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        ) : (
          <>
            {selectedTeamId && draftedPlayers[selectedTeamId]?.length > 0 ? (
              <>
                <p className="text-sm text-primary-gray mb-4">
                  {draftedPlayers[selectedTeamId].length} players in {selectedTeam?.name || selectedTeamId}
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {draftedPlayers[selectedTeamId].map((playerId: number) => {
                    const player = players.find((p: Player) => p.id === playerId);
                    const isLocked = lockToken === player?.tradeLockedWeek;
                    if (!player) return null;
                    return (
                      <PlayerCardDetailed
                        key={player.id}
                        player={player}
                        isOwned={true}
                        onAdd={() => {}}
                        onRemove={() => handleUndraftPlayer(player.id, player.name)}
                        isLocked={isLocked}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto text-primary-gray mb-4" />
                <p className="text-primary-gray text-lg font-medium">
                  {selectedTeamId ? 'No players added yet' : 'Select a team to view players'}
                </p>
                <p className="text-sm text-primary-gray font-medium mt-2">
                  {selectedTeamId ? 'Start adding players from the "All Players" tab' : 'Choose a team from the dropdown above'}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default PlayersManagementCard;
