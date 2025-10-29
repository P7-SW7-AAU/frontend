"use client";

import { useState } from 'react';
import { toast } from 'sonner'
import { Trophy, Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

import Container from '@/components/Container';
import Header from '@/components/Header';
import BudgetCard from '@/components/lineup/BudgetCard';
import PlayersManagementCard from '@/components/lineup/PlayersManagementCard';

import { getUserTeams, getAvailablePlayers, sports, getPlayersBySport, MAX_PLAYERS_PER_TEAM } from '@/data/multiSportMockData';

import { useApi } from "@/hooks/useApi";

import { createTeam } from "@/services/teamsService";

interface TempTeamClientProps {
  tempTeamId: string;
}

const TEAM_BUDGET = 200; // Budget in millions

const TempTeamClient = ({ tempTeamId }: TempTeamClientProps) => {
  const { api } = useApi();
  const router = useRouter();
  const userTeams = getUserTeams();
  const allPlayers = getAvailablePlayers();
  const [isLoading, setIsLoading] = useState(false);
  const selectedTeamId = tempTeamId;
  const [draftedPlayers, setDraftedPlayers] = useState<Record<string, string[]>>({});

  const selectedTeam = userTeams.find(team => team.uniqueID === selectedTeamId);

  const onSubmit = (data: any) => {
    setIsLoading(true);

    createTeam(data, api)
        .then(() => {
            toast.success("Team created successfully!");
            router.push('/teams');
        })
        .catch((error) => {
            toast.error("Error creating team: " + error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
  }
  
  const getBudgetSpent = (teamId: string) => {
    const drafted = draftedPlayers[teamId] || [];
    return drafted.reduce((sum, playerId) => {
      const player = getAvailablePlayers().find(p => p.uniqueID === playerId);
      return sum + (player?.value || 0);
    }, 0);
  }
  
  const getRemainingBudget = (teamId: string) => {
    return TEAM_BUDGET - getBudgetSpent(teamId);
  }
  
  const getDraftedCount = (teamId: string) => {
    return (draftedPlayers[teamId] || []).length;
  }
  
  const getRemainingSlots = (teamId: string) => {
    const currentPlayers = selectedTeam?.playerCount || 0;
    const draftedCount = getDraftedCount(teamId);
    return MAX_PLAYERS_PER_TEAM - currentPlayers - draftedCount;
  }

  const handleDraftPlayer = (playerId: string, playerName: string) => {
    if (!selectedTeamId) {
      toast.message("No team selected");
      return;
    }
    
    const player = allPlayers.find(p => p.uniqueID === playerId);
    if (!player) return;
    
    if (player.value > getRemainingBudget(selectedTeamId)) {
      toast.message("Insufficient budget");
      return;
    }
    
    if (getRemainingSlots(selectedTeamId) <= 0) {
      toast.message("You've reached the maximum number of players");
      return;
    }

    setDraftedPlayers(prev => ({
      ...prev,
      [selectedTeamId]: [...(prev[selectedTeamId] || []), playerId]
    }));

    toast.message(`${playerName} joined for $${player.value}M! ${getRemainingSlots(selectedTeamId) - 1} slots left.`);
  }

  const handleUndraftPlayer = (playerId: string, playerName: string) => {
    setDraftedPlayers(prev => ({
      ...prev,
      [selectedTeamId]: (prev[selectedTeamId] || []).filter(id => id !== playerId)
    }));

    toast.message(`${playerName} has been removed from ${tempTeamId}.`);
  }

  return (
    <Container>
      <Header 
        title="Team Manager" 
        description="Start building your fantasy team by adding players" 
        icon={Trophy} 
        buttonText="Save Changes" 
        buttonIcon={Plus} 
        buttonIconSize="5" 
        onClick={() => {}} 
        isLoading={isLoading} 
      />

      <div className="grid gap-6 mb-6 md:grid-cols-2">  
        {selectedTeamId && (
          <BudgetCard
            teamBudget={TEAM_BUDGET}
            maxPlayersPerTeam={MAX_PLAYERS_PER_TEAM}
            selectedTeamId={selectedTeamId}
            getRemainingBudget={getRemainingBudget}
            getBudgetSpent={getBudgetSpent}
            getRemainingSlots={getRemainingSlots}
            getDraftedCount={getDraftedCount}
          />
        )}
      </div>

      <PlayersManagementCard
        allPlayers={allPlayers}
        draftedPlayers={draftedPlayers}
        selectedTeamId={selectedTeamId}
        selectedTeam={selectedTeam}
        sports={sports}
        getPlayersBySport={getPlayersBySport}
        handleDraftPlayer={handleDraftPlayer}
        handleUndraftPlayer={handleUndraftPlayer}
        getRemainingBudget={getRemainingBudget}
        getRemainingSlots={getRemainingSlots}
      />
    </Container>
  );
}

export default TempTeamClient;
