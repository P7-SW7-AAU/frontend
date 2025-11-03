"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Trophy, Target, Calendar } from 'lucide-react';

import { useCreateTeamModal } from '@/hooks/useCreateTeamModal';
import { useDeleteTeamModal } from "@/hooks/useDeleteTeamModal";
import { useEditTeamModal } from "@/hooks/useEditTeamModal";

import ActionCard from '@/components/ActionCard';
import StatsCard from '@/components/StatsCard';
import Container from '@/components/Container';
import Header from '@/components/Header';
import TeamCard from '@/components/teams/TeamCard';

import { Team } from '@/types';
import DeleteTeamModal from '@/components/modals/DeleteTeamModal';
import EditTeamModal from '@/components/modals/EditTeamModal';

interface TeamsClientProps {
  teams: Team[];
}

const TeamsClient = ({ teams }: TeamsClientProps) => {
  const createTeamModal = useCreateTeamModal();
  const deleteTeamModal = useDeleteTeamModal();
  const editTeamModal = useEditTeamModal();
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleDelete = (teamId: string) => {
    setSelectedTeamId(teamId);
    deleteTeamModal.onOpen();
  }

  const handleEdit = (teamId: string) => {
    setSelectedTeamId(teamId);
    editTeamModal.onOpen();
  }

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  return (
    <Container>
      <DeleteTeamModal teamId={selectedTeamId} />
      <EditTeamModal teamId={selectedTeamId} teamName={selectedTeam?.name} />

      <Header 
        title="My Teams"
        description="Manage your multi-sport fantasy teams"
        buttonText="Create Team"
        buttonIcon={Plus}
        buttonIconSize="5"
        onClick={createTeamModal.onOpen}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Teams" 
          value={teams.length} 
          valueColor="text-white" 
          description="active teams" 
          icon={Users} 
          iconColor="text-primary-green" 
        />

        <StatsCard 
          title="Total Players" 
          value={teams.reduce((sum, team) => sum + team.players.length, 0)} 
          valueColor="text-primary-green" 
          description="across all teams" 
          icon={Target} 
          iconColor="text-primary-green" 
        />

        <StatsCard 
          title="Total Value" 
          value={`$${teams.reduce((sum, team) => sum + team.players.reduce((playerSum, player) => playerSum + player.value, 0), 0).toFixed(1)}M`} 
          valueColor="text-primary-yellow" 
          description="combined value" 
          icon={Trophy} 
          iconColor="text-primary-yellow" 
        />

        <StatsCard 
          title="Sports Covered" 
          value={5} 
          valueColor="text-white" 
          description="different sports" 
          icon={Calendar} 
          iconColor="text-primary-gray" 
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Your Teams</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => handleEdit(team.id)}
              onDelete={() => handleDelete(team.id)}
              onManage={(teamId) => router.push(`/teams/lineup?team=${teamId}`)}
            />
          ))}

          <ActionCard 
            title="Create Team"
            description="Build another multi-sport fantasy team with players from different sports"
            onClick={createTeamModal.onOpen}
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

export default TeamsClient;
