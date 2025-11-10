"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Trophy, Target, Crown } from 'lucide-react';

import ActionCard from '@/components/ActionCard';
import StatsCard from '@/components/StatsCard';
import Container from '@/components/Container';
import Header from "@/components/Header";
import LeagueCard from '@/components/leagues/LeagueCard';

import { useCreateLeagueModal } from "@/hooks/useCreateLeagueModal";
import { useDeleteLeagueModal } from '@/hooks/useDeleteLeagueModal';
import { useEditLeagueModal } from "@/hooks/useEditLeagueModal";
import { useJoinLeagueModal } from "@/hooks/useJoinLeagueModal";
import { useSelectTeamModal } from "@/hooks/useSelectTeam";

import { League, Team } from "@/types";
import DeleteLeagueModal from "@/components/modals/DeleteLeagueModal";
import EditLeagueModal from "@/components/modals/EditLeagueModal";
import SelectTeamModal from "@/components/modals/SelectTeamModal";

interface LeaguesClientProps {
  currentUser: any;
  leagues: League[];
  teams: Team[];
}

const LeaguesClient = ({ currentUser, leagues, teams }: LeaguesClientProps) => {
  const router = useRouter();
  
  const createLeagueModal = useCreateLeagueModal();
  const deleteLeagueModal = useDeleteLeagueModal();
  const editLeagueModal = useEditLeagueModal();
  const joinLeagueModal = useJoinLeagueModal();
  const selectTeamModal = useSelectTeamModal();

  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);

  const getLeagueStats = () => {
    const totalLeagues = leagues.length;
    const adminCount = leagues.filter(l => l.commissionerId === currentUser.id).length;
    const totalTeamsInLeagues = leagues.reduce((sum, league) => {
      return sum + league.counts.teams;
    }, 0);

    return { totalLeagues, adminCount, totalTeamsInLeagues };
  }

  const stats = getLeagueStats();

  const handleDelete = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    deleteLeagueModal.onOpen();
  }

  const handleEdit = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    editLeagueModal.onOpen();
  }

  const handleSelectTeam = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    selectTeamModal.onOpen();
  }

  const selectedLeague = leagues.find((league) => league.id === selectedLeagueId);
  const selectedTeam = teams.find(team => team.leagueId === selectedLeagueId)
    ? {
        id: teams.find(team => team.leagueId === selectedLeagueId)!.id,
      }
    : null;

  return (
    <Container>
      <DeleteLeagueModal leagueId={selectedLeagueId} />
      <EditLeagueModal 
        leagueId={selectedLeagueId} 
        leagueName={selectedLeague?.name} 
        maxTeams={selectedLeague?.maxTeams} 
        currentTeamsCount={selectedLeague?.counts.teams}
      />
      <SelectTeamModal leagueId={selectedLeagueId} selectedTeam={selectedTeam} teams={teams} />

      <Header 
        title="My Leagues" 
        description="Manage your league participation and track your performance" 
        buttonText="Create League"
        buttonIcon={Plus}
        buttonIconSize="5"
        onClick={createLeagueModal.onOpen}
        secondaryButtonText="Join League"
        secondaryButtonIcon={Trophy}
        secondaryButtonIconSize="4"
        secondaryOnClick={joinLeagueModal.onOpen}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Leagues" 
          value={stats.totalLeagues} 
          valueColor="text-white" 
          description="active leagues" 
          icon={Trophy} 
          iconColor="text-primary-green" 
        />

        <StatsCard 
          title="Teams Active" 
          value={stats.totalTeamsInLeagues} 
          valueColor="text-primary-green" 
          description="across leagues" 
          icon={Users} 
          iconColor="text-primary-green" 
        />

        <StatsCard 
          title="Owner Of" 
          value={stats.adminCount} 
          valueColor="text-primary-yellow" 
          description="leagues managed" 
          icon={Crown} 
          iconColor="text-primary-yellow" 
        />

        <StatsCard 
          title="Best Rank" 
          value={"#10"} 
          valueColor="text-white" 
          description="highest position" 
          icon={Target} 
          iconColor="text-primary-gray" 
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Your Leagues</h2>        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leagues.map((league) => (
            <LeagueCard
              key={league.id}
              league={league}
              teams={teams}
              currentUser={currentUser}
              onEdit={() => handleEdit(league.id)}
              onDelete={() => handleDelete(league.id)}
              onViewLeague={(id: string) => router.push(`/leagues/${id}`)}
              onSelectTeam={() => handleSelectTeam(league.id)}
            />
          ))}

          <ActionCard 
            title="Join League"
            description="Enter a league code to join an existing league with your teams"
            onClick={joinLeagueModal.onOpen}
            icon={Trophy}
            iconColor="text-primary-yellow"
            iconBgColor="bg-[#2A2A23]"
            hoverColor="hover:border-[#846F2F]"
          />

          <ActionCard 
            title="Create League"
            description="Start your own multi-sport fantasy league and invite friends"
            onClick={createLeagueModal.onOpen}
            icon={Plus}
            iconColor="text-primary-green"
            iconBgColor="bg-[#152624]"
            hoverColor="hover:border-[#1D5D36]"
          />
        </div>
      </div>
    </Container>
  );
}

export default LeaguesClient;
