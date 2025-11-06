"use client";

import { useState } from 'react';
import { toast } from 'sonner'
import { Trophy, Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

import Container from '@/components/Container';
import Header from '@/components/Header';
import BudgetCard from '@/components/lineup/BudgetCard';
import PlayersManagementCard from '@/components/lineup/PlayersManagementCard';

import { useApi } from "@/hooks/useApi";

import { createTeam } from "@/services/teamsService";
import { Player } from '@/types';

import { weekTokenCET  } from '@/lib/utils';

interface TempTeamClientProps {
  tempTeamId: string;
  players: Player[];
}

const TEAM_BUDGET = 50000000;
const MAX_PLAYERS_PER_TEAM = 10;

const TempTeamClient = ({ tempTeamId, players }: TempTeamClientProps) => {
  const lockToken = weekTokenCET();
  const { api } = useApi();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const selectedTeamId = tempTeamId;
  // draftedPlayers is a map from teamId -> array of player IDs
  const [draftedPlayers, setDraftedPlayers] = useState<Record<string, number[]>>({});

  const onSubmit = () => {
    const draftedCount = getDraftedCount(selectedTeamId);
    if (draftedCount !== MAX_PLAYERS_PER_TEAM) {
      toast.message(`You must draft exactly ${MAX_PLAYERS_PER_TEAM} players before submitting. Currently drafted: ${draftedCount}.`);
      return;
    }
    setIsLoading(true);

    // Transform draftedPlayers to [{ sport, externalId }]
    const draftedPlayerObjects =
      (draftedPlayers[selectedTeamId] || []).map((playerId) => {
        const player = players.find((p) => p.id === playerId);
        return player
          ? { sport: player.sport, externalId: player.id }
          : null;
      }).filter(Boolean);

    createTeam(
      { name: tempTeamId, players: draftedPlayerObjects },
      api
    )
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
      const player = players.find(p => p.id === playerId);
      return sum + (player?.price || 0);
    }, 0);
  }
  
  const getRemainingBudget = (teamId: string) => {
    return TEAM_BUDGET - getBudgetSpent(teamId);
  }
  
  const getDraftedCount = (teamId: string) => {
    return (draftedPlayers[teamId] || []).length;
  }
  
  const getRemainingSlots = (teamId: string) => {
    const currentPlayers = 0;
    const draftedCount = getDraftedCount(teamId);
    return MAX_PLAYERS_PER_TEAM - currentPlayers - draftedCount;
  }

  const handleDraftPlayer = (playerId: number, playerName: string) => {
    if (!selectedTeamId) {
      toast.message("No team selected");
      return;
    }
    
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    if (player.price > getRemainingBudget(selectedTeamId)) {
      toast.message("Insufficient budget");
      return;
    }
    
    if (getRemainingSlots(selectedTeamId) <= 0) {
      toast.message("You've reached the maximum number of players");
      return;
    }

    setDraftedPlayers(prev => {
      const teamDrafts = prev[selectedTeamId] || [];
      return {
        ...prev,
        [selectedTeamId]: [...teamDrafts, playerId],
      };
    });

    toast.message(`${playerName} joined for $${(player.price / 1_000_000).toFixed(1)}M! ${getRemainingSlots(selectedTeamId) - 1} slots left.`);
  }

  const handleUndraftPlayer = (playerId: number, playerName: string) => {
    setDraftedPlayers(prev => {
      const teamDrafts = (prev[selectedTeamId] || []).filter(id => id !== playerId);
      return {
        ...prev,
        [selectedTeamId]: teamDrafts,
      };
    });

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
        onClick={onSubmit} 
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
        players={players}
        draftedPlayers={draftedPlayers}
        selectedTeamId={selectedTeamId}
        handleDraftPlayer={handleDraftPlayer}
        handleUndraftPlayer={handleUndraftPlayer}
        getRemainingBudget={getRemainingBudget}
        getRemainingSlots={getRemainingSlots}
        lockToken={lockToken}
      />
    </Container>
  );
}

export default TempTeamClient;
