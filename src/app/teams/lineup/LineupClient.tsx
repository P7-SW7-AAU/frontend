"use client";

import { useState } from 'react';
import { toast } from 'sonner'
import { Trophy, Plus } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';

import Header from '@/components/Header';
import Container from '@/components/Container';
import BudgetCard from '@/components/lineup/BudgetCard';
import PlayersManagementCard from '@/components/lineup/PlayersManagementCard';
import TeamSelectorCard from '@/components/lineup/TeamSelectorCard';

import { getUserTeams } from '@/data/multiSportMockData';
import { Player } from '@/types';

interface LineupClientProps {
  players: Player[];
}

const TEAM_BUDGET = 200; // Budget in millions
const MAX_PLAYERS_PER_TEAM = 10;

const LineupClient = ({ players }: LineupClientProps) => {
  const router = useRouter();
  const userTeams = getUserTeams();
  const searchParams = useSearchParams();
  const initialTeamId = searchParams.get('team') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(initialTeamId);
  const [draftedPlayers, setDraftedPlayers] = useState<Record<string, number[]>>({});

  const selectedTeam = userTeams.find(team => team.uniqueID === selectedTeamId);
  
  const getBudgetSpent = (teamId: string) => {
    const drafted = draftedPlayers[teamId] || [];
    return drafted.reduce((sum, playerId) => {
      const player = players.find(p => p.id === playerId);
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
      
      if (player.value > getRemainingBudget(selectedTeamId)) {
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
  
      toast.message(`${playerName} joined for $${player.value}M! ${getRemainingSlots(selectedTeamId) - 1} slots left.`);
    }
  
    const handleUndraftPlayer = (playerId: number, playerName: string) => {
      setDraftedPlayers(prev => {
        const teamDrafts = (prev[selectedTeamId] || []).filter(id => id !== playerId);
        return {
          ...prev,
          [selectedTeamId]: teamDrafts,
        };
      });

      toast.message(`${playerName} has been removed from ${selectedTeam?.name}.`);
    }

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('team', teamId);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <Container>
      <Header 
        title="Team Manager" 
        description="Build your fantasy team" 
        icon={Trophy} 
        buttonText="Save Changes" 
        buttonIcon={Plus} 
        buttonIconSize="5" 
        onClick={() => {}} 
        isLoading={isLoading} 
      />

      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <TeamSelectorCard 
          userTeams={userTeams} 
          selectedTeamId={selectedTeamId} 
          handleTeamChange={handleTeamChange}
        />
        
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
        selectedTeam={selectedTeam}
        handleDraftPlayer={handleDraftPlayer}
        handleUndraftPlayer={handleUndraftPlayer}
        getRemainingBudget={getRemainingBudget}
        getRemainingSlots={getRemainingSlots}
      />
    </Container>
  );
}

export default LineupClient;
