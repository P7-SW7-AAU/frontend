"use client";

import { useRouter } from 'next/navigation';
import { Plus, Users, Trophy, Target, Calendar } from 'lucide-react';

import { getUserTeams, getCurrentUser } from '@/data/multiSportMockData';

import { useCreateTeamModal } from '@/hooks/useCreateTeamModal';
import { useDeleteTeamModal } from "@/hooks/useDeleteTeamModal";
import { useEditTeamModal } from "@/hooks/useEditTeamModal";

import CardStats from '@/components/CardStats';
import CardAction from '@/components/CardAction';
import Container from '@/components/Container';
import Header from '@/components/Header';
import TeamCard from '@/components/teams/TeamCard';

const TeamsClient = () => {
  const currentUser = getCurrentUser();
  const userTeams = getUserTeams(currentUser.uniqueID);
  const createTeamModal = useCreateTeamModal();
  const deleteTeamModal = useDeleteTeamModal();
  const editTeamModal = useEditTeamModal();
  const router = useRouter();

  return (
    <Container>
      <Header 
        title="My Teams"
        description="Manage your multi-sport fantasy teams"
        buttonText="Create Team"
        buttonIcon={Plus}
        buttonIconSize="5"
        onClick={createTeamModal.onOpen}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <CardStats 
          title="Total Teams" 
          value={userTeams.length} 
          valueColor="text-white" 
          description="active teams" 
          icon={Users} 
          iconColor="text-primary-green" 
        />

        <CardStats 
          title="Total Players" 
          value={userTeams.reduce((sum, team) => sum + team.playerCount, 0)} 
          valueColor="text-primary-green" 
          description="across all teams" 
          icon={Target} 
          iconColor="text-primary-green" 
        />

        <CardStats 
          title="Total Value" 
          value={`$${userTeams.reduce((sum, team) => sum + team.valueSum, 0).toFixed(1)}M`} 
          valueColor="text-primary-yellow" 
          description="combined value" 
          icon={Trophy} 
          iconColor="text-primary-yellow" 
        />

        <CardStats 
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
          {userTeams.map((team) => (
            <TeamCard
              key={team.uniqueID}
              team={team}
              onEdit={editTeamModal.onOpen}
              onDelete={deleteTeamModal.onOpen}
              onManage={(teamId) => router.push(`/teams/lineup?team=${teamId}`)}
            />
          ))}

          <CardAction 
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
