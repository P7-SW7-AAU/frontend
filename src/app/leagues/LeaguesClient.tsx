"use client";

import { useRouter } from "next/navigation";
import { Plus, Users, Trophy, Target, Crown } from 'lucide-react';

import ActionCard from '@/components/ActionCard';
import StatsCard from '@/components/StatsCard';
import Container from '@/components/Container';
import Header from "@/components/Header";
import LeagueCard from '@/components/leagues/LeagueCard';

import { 
  getCurrentUser, 
  leagues, 
  teamLeagues, 
  getUserTeams,
  getLeagueById,
  getLeagueStandings 
} from '@/data/multiSportMockData';

import { useCreateLeagueModal } from "@/hooks/useCreateLeagueModal";
import { useDeleteLeagueModal } from '@/hooks/useDeleteLeagueModal';
import { useEditLeagueModal } from "@/hooks/useEditLeagueModal";
import { useJoinLeagueModal } from "@/hooks/useJoinLeagueModal";
import { useSelectTeamModal } from "@/hooks/useSelectTeam";

const LeaguesClient = () => {
  const currentUser = getCurrentUser();
  const userTeams = getUserTeams(currentUser.uniqueID);
  const router = useRouter();
  
  const createLeagueModal = useCreateLeagueModal();
  const deleteLeagueModal = useDeleteLeagueModal();
  const editLeagueModal = useEditLeagueModal();
  const joinLeagueModal = useJoinLeagueModal();
  const selectTeamModal = useSelectTeamModal();

  const getUserLeagues = () => {
    const userTeamIds = userTeams.map(team => team.uniqueID);
    const userLeagueIds = teamLeagues
      .filter(tl => userTeamIds.includes(tl.team_ID) && tl.isActive)
      .map(tl => tl.league_ID);
    
    return leagues
      .filter(league => userLeagueIds.includes(league.uniqueID))
      .map(league => {
        const leagueData = getLeagueById(league.uniqueID);
        const standings = getLeagueStandings(league.uniqueID);
        const userTeamsInLeague = userTeams.filter(team => 
          teamLeagues.some(tl => 
            tl.team_ID === team.uniqueID && 
            tl.league_ID === league.uniqueID && 
            tl.isActive
          )
        );
        
        return {
          ...league,
          standings,
          userTeamsInLeague,
          totalTeams: leagueData?.teams.length || 0,
          isAdmin: league.admin_ID === currentUser.uniqueID
        }
      });
  }

  const userLeagues = getUserLeagues();

  const getLeagueStats = () => {
    const totalLeagues = userLeagues.length;
    const adminCount = userLeagues.filter(l => l.isAdmin).length;
    const totalTeamsInLeagues = userLeagues.reduce((sum, league) => {
      return sum + league.userTeamsInLeague.length;
    }, 0);
    const bestRanking = Math.min(...userLeagues.flatMap(league => 
      league.userTeamsInLeague.map(team => {
        const standing = league.standings.find(s => s.uniqueID === team.uniqueID);
        return standing?.ranking || 999;
      })
    ));

    return { totalLeagues, adminCount, totalTeamsInLeagues, bestRanking };
  }

  const stats = getLeagueStats();

  return (
    <Container>
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
          title="Admin of" 
          value={stats.adminCount} 
          valueColor="text-primary-yellow" 
          description="leagues managed" 
          icon={Crown} 
          iconColor="text-primary-yellow" 
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
          title="Best Rank" 
          value={stats.bestRanking === 999 ? 'N/A' : `#${stats.bestRanking}`} 
          valueColor="text-white" 
          description="highest position" 
          icon={Target} 
          iconColor="text-primary-gray" 
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Your Leagues</h2>        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userLeagues.map((league) => (
            <LeagueCard
              key={league.uniqueID}
              league={league}
              onEdit={editLeagueModal.onOpen}
              onDelete={deleteLeagueModal.onOpen}
              onViewLeague={(id: string) => router.push(`/leagues/${id}`)}
              onSelectTeam={selectTeamModal.onOpen}
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
