"use client";

import { useState } from 'react';
import { toast } from 'sonner'
import { TrendingUp, TrendingDown, Minus, DollarSign, Trophy, Zap, Target, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Navbar from '@/components/Navbar';
import PlayerCardDetailed from '@/components/PlayerCardDetailed';

import { getUserTeams, getAvailablePlayers, sports, getPlayersBySport, MAX_PLAYERS_PER_TEAM } from '@/data/multiSportMockData';

const TEAM_BUDGET = 200; // Budget in millions

const LineupClient = () => {
  const userTeams = getUserTeams();
  const allPlayers = getAvailablePlayers();
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftedPlayers, setDraftedPlayers] = useState<Record<string, string[]>>({});
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');

  const selectedTeam = userTeams.find(team => team.uniqueID === selectedTeamId);
  
  // Calculate budget spent
  const getBudgetSpent = (teamId: string) => {
    const drafted = draftedPlayers[teamId] || [];
    return drafted.reduce((sum, playerId) => {
      const player = getAvailablePlayers().find(p => p.uniqueID === playerId);
      return sum + (player?.value || 0);
    }, 0);
  };
  
  const getRemainingBudget = (teamId: string) => {
    return TEAM_BUDGET - getBudgetSpent(teamId);
  };
  
  const getDraftedCount = (teamId: string) => {
    return (draftedPlayers[teamId] || []).length;
  };
  
  const getRemainingSlots = (teamId: string) => {
    const currentPlayers = selectedTeam?.playerCount || 0;
    const draftedCount = getDraftedCount(teamId);
    return MAX_PLAYERS_PER_TEAM - currentPlayers - draftedCount;
  };
  
  // Check if player is on selected team
  const isPlayerOnTeam = (playerId: string) => {
    return draftedPlayers[selectedTeamId]?.includes(playerId) || false;
  };
  
  // Filter players by sport and search query
  const filteredPlayers = allPlayers.filter(player => {
    // Sport filter
    if (selectedSport !== 'all') {
      const sportPlayers = getPlayersBySport(selectedSport);
      if (!sportPlayers.some(sp => sp.uniqueID === player.uniqueID)) {
        return false;
      }
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = player.name.toLowerCase().includes(query);
      const matchesTeam = player.sportsTeam.name.toLowerCase().includes(query);
      const matchesPosition = player.position.toLowerCase().includes(query);
      return matchesName || matchesTeam || matchesPosition;
    }
    
    return true;
  });

  const handleDraftPlayer = (playerId: string, playerName: string) => {
    if (!selectedTeamId) {
      toast.message("No team selected");
      return;
    }
    
    const player = allPlayers.find(p => p.uniqueID === playerId);
    if (!player) return;
    
    // Check budget
    if (player.value > getRemainingBudget(selectedTeamId)) {
      toast.message("Insufficient budget");
      return;
    }
    
    // Check team slots
    if (getRemainingSlots(selectedTeamId) <= 0) {
      toast.message("You've reached the maximum number of players");
      return;
    }

    setDraftedPlayers(prev => ({
      ...prev,
      [selectedTeamId]: [...(prev[selectedTeamId] || []), playerId]
    }));

    toast.message(`${playerName} joined for $${player.value}M! ${getRemainingSlots(selectedTeamId) - 1} slots left.`);
  };

  const handleUndraftPlayer = (playerId: string, playerName: string) => {
    setDraftedPlayers(prev => ({
      ...prev,
      [selectedTeamId]: (prev[selectedTeamId] || []).filter(id => id !== playerId)
    }));

    toast.message(`${playerName} has been removed from ${selectedTeam?.name}.`);
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-primary-green" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'injured': return 'destructive';
      case 'bye': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-primary-green animate-pulse" />
            <div>
              <h1 className="text-4xl font-bold text-white">Team Manager</h1>
              <p className="text-primary-gray font-medium mt-1">Build your dream team</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <Card className="hover:shadow-card transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-white font-bold">
                <Target className="h-5 w-5 text-primary-green" />
                Select Your Team
              </CardTitle>
              <CardDescription className="text-primary-gray font-medium">Choose which team to modify your lineup for</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {userTeams.map(team => (
                    <SelectItem key={team.uniqueID} value={team.uniqueID}>
                      <div className="flex items-center gap-2">
                        <span className="text-white group-hover:text-black group-focus:text-black font-semibold">{team.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {team.playerCount} players
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          {selectedTeamId && (
            <Card className="hover:shadow-card transition-smooth border-[#16A149] bg-[#152323]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-2xl font-bold">
                  <DollarSign className="h-5 w-5 text-white" />
                  Team Budget & Slots
                </CardTitle>
                <CardDescription className="text-primary-gray font-medium">Manage your resources wisely</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary-gray">Budget Remaining</span>
                    <span className="text-2xl font-bold text-white">
                      ${getRemainingBudget(selectedTeamId).toFixed(1)}M
                    </span>
                  </div>
                  <Progress 
                    value={(getRemainingBudget(selectedTeamId) / TEAM_BUDGET) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-primary-gray font-medium mt-1">
                    ${getBudgetSpent(selectedTeamId).toFixed(1)}M / ${TEAM_BUDGET}M spent
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary-gray">Team Slots</span>
                    <span className="text-2xl font-bold text-white">
                      {getRemainingSlots(selectedTeamId)} / {MAX_PLAYERS_PER_TEAM}
                    </span>
                  </div>
                  <Progress 
                    value={(getRemainingSlots(selectedTeamId) / MAX_PLAYERS_PER_TEAM) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-primary-gray font-medium mt-1">
                    {getDraftedCount(selectedTeamId)} added this session
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="hover:shadow-card transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-2xl font-bold">
              <Zap className="h-6 w-6 text-primary-green" />
              Player Management
            </CardTitle>
            <CardDescription className="mt-1 text-primary-gray font-medium">
              Manage your team and find new talent
            </CardDescription>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 mt-6">
              <div className="relative flex-1 bg-[#0F141B]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary-gray" />
                <Input
                  placeholder="Search players, teams, positions..."
                  className="pl-10 border-[#1E2938] text-white font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Sport Filter */}
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
                    key={sport.uniqueID}
                    variant={selectedSport === sport.uniqueID ? 'hero' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSport(sport.uniqueID)}
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
                  {filteredPlayers.map((player) => (
                    <PlayerCardDetailed
                      key={player.uniqueID}
                      player={player}
                      isOwned={isPlayerOnTeam(player.uniqueID)}
                      onAdd={() => handleDraftPlayer(player.uniqueID, player.name)}
                      onRemove={() => handleUndraftPlayer(player.uniqueID, player.name)}
                      getTrendIcon={getTrendIcon}
                      getStatusColor={getStatusColor}
                      disabled={
                        !selectedTeamId ||
                        player.value > getRemainingBudget(selectedTeamId) ||
                        getRemainingSlots(selectedTeamId) <= 0
                      }
                    />
                  ))}
                </div>

                {filteredPlayers.length === 0 && (
                  <div className="text-center py-12 col-span-full">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-lg">No players found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {selectedTeamId && draftedPlayers[selectedTeamId]?.length > 0 ? (
                  <>
                    <p className="text-sm text-primary-gray mb-4">
                      {draftedPlayers[selectedTeamId].length} players in {selectedTeam?.name}
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {draftedPlayers[selectedTeamId].map((playerId, index) => {
                        const player = getAvailablePlayers().find(p => p.uniqueID === playerId);
                        if (!player) return null;
                        return (
                          <PlayerCardDetailed
                            key={player.uniqueID}
                            player={player}
                            isOwned={true}
                            onAdd={() => {}}
                            onRemove={() => handleUndraftPlayer(player.uniqueID, player.name)}
                            getTrendIcon={getTrendIcon}
                            getStatusColor={getStatusColor}
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
      </main>
    </div>
  );
};

export default LineupClient;
