"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'
import { ArrowUp, Trophy, Plus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

import Container from '@/components/Container';
import DraftedPlayerDelta from '@/components/teams/DraftedPlayerDelta';
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

const BATCH_SIZE = 10; // Number of DraftedPlayerDelta components to render per batch
const BATCH_DELAY = 400;

const TempTeamClient = ({ tempTeamId, players }: TempTeamClientProps) => {
  const { api } = useApi();
  const router = useRouter();
  const lockToken = weekTokenCET();

  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deltaBatchCount, setDeltaBatchCount] = useState(BATCH_SIZE);
  const [draftedPlayers, setDraftedPlayers] = useState<Record<string, number[]>>({}); // draftedPlayers is a map from teamId -> array of player IDs
  const [playersState, setPlayersState] = useState<Player[]>(players);
  const [playerLiveDeltas, setPlayerLiveDeltas] = useState<Record<number, number | undefined>>({}); // State to track liveDelta for each drafted player 

  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedTeamId = tempTeamId;

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
  
  const getBudgetSpent = (teamId: string) => { 
    const drafted = draftedPlayers[teamId] || []; 
    return drafted.reduce((sum, playerId) => { 
      const player = players.find(p => p.id === playerId); 
      const liveDelta = playerLiveDeltas[playerId]; 
      return sum + ((player?.price || 0) + (liveDelta ?? player?.weekPriceChange ?? 0)); 
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
        [selectedTeamId]: [...teamDrafts, playerId],
      };
    });

    toast.message(`${playerName} joined for $${((player.price + player.weekPriceChange) / 1_000_000).toFixed(1)}M! ${getRemainingSlots(selectedTeamId) - 1} slots left.`);
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

      {players.slice(0, deltaBatchCount).map(player => (
        <DraftedPlayerDelta key={player.id} player={player} onDelta={handlePlayerDelta} />
      ))}

      <PlayersManagementCard
        players={playersState}
        draftedPlayers={draftedPlayers}
        selectedTeamId={selectedTeamId}
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

export default TempTeamClient;
