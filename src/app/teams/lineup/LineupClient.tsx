"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner'
import { ArrowUp, Trophy, Plus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

import Container from '@/components/Container';
import DraftedPlayerDelta from '@/components/teams/DraftedPlayerDelta';
import Header from '@/components/Header';
import BudgetCard from '@/components/lineup/BudgetCard';
import PlayersManagementCard from '@/components/lineup/PlayersManagementCard';
import TeamSelectorCard from '@/components/lineup/TeamSelectorCard';

import { useApi } from "@/hooks/useApi";

import { updateTeam } from "@/services/teamsService";

import { Player, Team } from '@/types';

import { weekTokenCET  } from '@/lib/utils';

interface LineupClientProps {
  players: Player[];
  teams: Team[];
}

const TEAM_BUDGET = 50000000;
const MAX_PLAYERS_PER_TEAM = 10;

const BATCH_SIZE = 10; // Number of DraftedPlayerDelta components to render per batch
const BATCH_DELAY = 700;

const LineupClient = ({ players, teams }: LineupClientProps) => {
  const { api } = useApi();
  const router = useRouter();
  const lockToken = weekTokenCET();
  
  const searchParams = useSearchParams();
  const initialTeamId = searchParams.get('team') || '';

  const [deltaBatchCount, setDeltaBatchCount] = useState(BATCH_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(initialTeamId);
  const [playersState, setPlayersState] = useState<Player[]>(players);
  const [playerLiveDeltas, setPlayerLiveDeltas] = useState<Record<number, number | undefined>>({}); // State to track liveDelta for each drafted player 

  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamically calculate the team budget in real time
  const getTeamBudget = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return TEAM_BUDGET;
    // Always use the sum of the original 10-player roster or TEAM_BUDGET, whichever is higher
    const originalRoster = team.roster || [];
    const originalSum = originalRoster.reduce((sum, rosterPlayer) => {
      const player = playersState.find(p => p.id === rosterPlayer.externalId && p.sport === rosterPlayer.sport);
      return sum + ((player?.price || 0) + (player?.weekPriceChange || 0));
    }, 0);
    return Math.max(TEAM_BUDGET, originalSum);
  }

  type DraftedPlayerKey = { id: number, sport: string };
  const [draftedPlayers, setDraftedPlayers] = useState<Record<string, DraftedPlayerKey[]>>(() => {
    const initialDrafts: Record<string, DraftedPlayerKey[]> = {};
    teams.forEach((team) => {
      initialDrafts[team.id] = team.roster?.map((p: Player) => ({ id: p.externalId, sport: p.sport })) || [];
    });
    return initialDrafts;
  });

  const onSubmit = () => {
    const draftedCount = getDraftedCount(selectedTeamId);
    if (draftedCount !== MAX_PLAYERS_PER_TEAM) {
      toast.message(`You must draft exactly ${MAX_PLAYERS_PER_TEAM} players before submitting. Currently drafted: ${draftedCount}.`);
      return;
    }
    setIsLoading(true);

    // Backend currently receives the entire player array in payload instead of updating the swapped players only. Minimal performance impact for 10 players though. Adjust to fit future backend changes if needed.
    const draftedPlayerObjects =
      (draftedPlayers[selectedTeamId] || []).map(({ id, sport }) => {
        const player = players.find((p) => p.id === id && p.sport === sport);
        return player
          ? { sport: player.sport, externalId: player.id }
          : null;
      }).filter(Boolean);

    updateTeam(
      selectedTeamId,
      { players: draftedPlayerObjects },
      api
    )
      .then(() => {
        toast.success("Team updated successfully!");
        router.push('/teams');
      })
      .catch((error) => {
        toast.error("Error updating team: " + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // Reset batching if players change
    setDeltaBatchCount(BATCH_SIZE);
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
    // Progressive batching
    if (players.length > BATCH_SIZE) {
      let current = BATCH_SIZE;
      function loadNextBatch() {
        if (current >= players.length) return;
        batchTimeoutRef.current = setTimeout(() => {
          current = Math.min(current + BATCH_SIZE, players.length);
          setDeltaBatchCount(current);
          loadNextBatch();
        }, BATCH_DELAY);
      }
      loadNextBatch();
    }
    return () => {
      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);
    };
  }, [players]);

  // Callback for DraftedPlayerDelta to report liveDelta 
  const handlePlayerDelta = (playerId: number, liveDelta: number | undefined) => { 
    setPlayerLiveDeltas(prev => {
      if (prev[playerId] === liveDelta) return prev; 
      return { ...prev, [playerId]: liveDelta }; 
    }); 
  }

  const selectedTeam = teams.find(team => team.id === selectedTeamId);
  
  // Use real-time player prices (with deltas) for budget spent
  const getBudgetSpent = (teamId: string) => {
    const drafted = draftedPlayers[teamId] || [];
    return drafted.reduce((sum, { id, sport }) => {
      const player = playersState.find(p => p.id === id && p.sport === sport);
      return sum + ((player?.price || 0) + (player?.weekPriceChange || 0));
    }, 0);
  }
  
  const getRemainingBudget = (teamId: string) => {
    const budget = getTeamBudget(teamId);
    const remaining = budget - getBudgetSpent(teamId);
    return remaining < 0 ? 0 : remaining;
  }
    
  const getDraftedCount = (teamId: string) => {
    return (draftedPlayers[teamId] || []).length;
  }
    
  const getRemainingSlots = (teamId: string) => {
    const currentPlayers = 0;
    const draftedCount = getDraftedCount(teamId);
    return MAX_PLAYERS_PER_TEAM - currentPlayers - draftedCount;
  }
  
  const handleDraftPlayer = (playerId: number, playerName: string, playerSport?: string) => {
    if (!selectedTeamId) {
      toast.message("No team selected");
      return;
    }

    // Use real-time player prices for draft checks
    const player = playersState.find(p => p.id === playerId && (!playerSport || p.sport === playerSport));
    if (!player) return;

    if ((player.price + player.weekPriceChange) > getRemainingBudget(selectedTeamId)) {
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
        [selectedTeamId]: [...teamDrafts, { id: playerId, sport: player.sport }],
      };
    });

    toast.message(`${playerName} joined the team! ${getRemainingSlots(selectedTeamId) - 1} slots left.`);
  }
  
  const handleUndraftPlayer = (playerId: number, playerName: string, playerSport?: string) => {
    setDraftedPlayers(prev => {
      const teamDrafts = (prev[selectedTeamId] || []).filter(p => !(p.id === playerId && (!playerSport || p.sport === playerSport)));
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1000);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    setPlayersState(prevPlayers =>
      prevPlayers.map(player => {
        const liveDelta = playerLiveDeltas[player.id];
        if (liveDelta !== undefined) {
          return { ...player, weekPriceChange: liveDelta };
        }
        return player;
      })
    );
  }, [playerLiveDeltas]);

  return (
    <Container>
      <Header 
        title="Team Manager" 
        description="Build your fantasy team" 
        icon={Trophy} 
        buttonText="Save Changes" 
        buttonIcon={Plus} 
        buttonIconSize="5" 
        onClick={onSubmit} 
        isLoading={isLoading} 
      />

      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <TeamSelectorCard 
          teams={teams} 
          selectedTeamId={selectedTeamId} 
          handleTeamChange={handleTeamChange}
        />
        
        {selectedTeamId && (
          <BudgetCard
            teamBudget={getTeamBudget(selectedTeamId)}
            maxPlayersPerTeam={MAX_PLAYERS_PER_TEAM}
            selectedTeamId={selectedTeamId}
            getRemainingBudget={getRemainingBudget}
            getBudgetSpent={getBudgetSpent}
            getRemainingSlots={getRemainingSlots}
            getDraftedCount={getDraftedCount}
          />
        )}
      </div>

      {players.slice(0, deltaBatchCount).map(player => (
        <DraftedPlayerDelta key={player.id + '-' + player.sport} player={player} onDelta={handlePlayerDelta} />
      ))}

      <PlayersManagementCard
        players={playersState}
        draftedPlayers={draftedPlayers}
        selectedTeamId={selectedTeamId}
        selectedTeam={selectedTeam}
        handleDraftPlayer={handleDraftPlayer}
        handleUndraftPlayer={handleUndraftPlayer}
        getRemainingBudget={getRemainingBudget}
        getRemainingSlots={getRemainingSlots}
        lockToken={lockToken}
      />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrollTop"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 bg-[#131920cc] text-white p-3 rounded-full shadow-lg hover:bg-[#1E2938] transition-all duration-300 ease-in-out border border-[#1E2938] cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-gray-100" />
          </motion.button>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default LineupClient;
