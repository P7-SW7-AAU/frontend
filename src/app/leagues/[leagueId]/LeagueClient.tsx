"use client";

import { Trophy, Eye, DoorOpen, Target, Users, Calendar } from 'lucide-react';

import StatsCard from '@/components/StatsCard';
import Container from '@/components/Container';
import Header from '@/components/Header';
import CardLeaderboard from '@/components/leagues/LeaderboardCard';
import LeaveLeagueModal from '@/components/modals/LeaveLeagueModal';

import { useLeaveLeagueModal } from '@/hooks/useLeaveLeagueModal';
import { League, UserProfile } from '@/types';
import { toast } from 'sonner';

interface LeagueClientProps {
    currentUser: UserProfile;
    league: League;
}

const LeagueClient = ({ league, currentUser }: LeagueClientProps) => {
    const leaveLeagueModal = useLeaveLeagueModal();

    const myTeam = league.teams.find(team => team.ownerId === currentUser.id) || null;
    const adminId = league.members.find(member => member.userId === league.commissionerId)?.userId;

    const teamValues = league.teams.map(team =>
        team.roster.reduce((sum, player) => sum + player.price + (typeof player.weekPriceChange === 'number' ? player.weekPriceChange : 0), 0)
    );

    const sortedTeams = [...league.teams]
        .map((team, idx) => ({ team, value: teamValues[idx] }))
        .sort((a, b) => b.value - a.value)
        .map(({ team }) => team);

    let week = 1;
    if (league.createdAt) {
        const created = new Date(league.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        week = Math.floor(diffDays / 7) + 1;
    }

    const handleCopyJoinCode = () => {
        navigator.clipboard.writeText(league.joinCode);
        toast.success(`Code ${league.joinCode} copied to clipboard!`);
    }

    return (
        <Container>
            <LeaveLeagueModal leagueId={league.id} teamId={myTeam?.id || null} />
            
            <Header
                title={league.name}
                description="Track the performance of all teams in the league"
                buttonText="Leave League"
                buttonIcon={DoorOpen}
                buttonIconSize="4"
                {...(adminId !== currentUser.id && { onClick: leaveLeagueModal.onOpen })}
                secondaryButtonText="View Code"
                secondaryButtonIcon={Eye}
                secondaryButtonIconSize="4"
                secondaryOnClick={handleCopyJoinCode}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatsCard 
                    title="Your Team" 
                    value={myTeam ? myTeam.name : "N/A"} 
                    valueColor="text-white" 
                    description="in the league" 
                    icon={Target} 
                    iconColor="text-primary-green" 
                />

                <StatsCard 
                    title="Total Teams" 
                    value={league.teams.length} 
                    valueColor="text-primary-green" 
                    description="in the league" 
                    icon={Users} 
                    iconColor="text-primary-green" 
                />

                <StatsCard 
                    title="Current Rank" 
                    value={myTeam ? `#${sortedTeams.findIndex(team => team.id === myTeam.id) + 1}` : 'N/A'}
                    valueColor="text-primary-yellow" 
                    description={`out of ${league.teams.length} teams`}
                    icon={Trophy} 
                    iconColor="text-primary-yellow" 
                />

                <StatsCard 
                    title="Week" 
                    value={week} 
                    valueColor="text-white" 
                    description={"since league started"}
                    icon={Calendar} 
                    iconColor="text-primary-gray" 
                />
            </div>

            <div className="space-y-6 mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <Trophy className="h-6 w-6 mr-2 text-primary-yellow" />
                    Leaderboard
                </h2>
                {league.teams.length === 0 ? (
                    <div className="text-primary-gray font-medium text-lg">No teams in this league yet.</div>
                ) : (
                    <div className="space-y-6">
                        {sortedTeams.map((team, index) => (
                            <CardLeaderboard 
                                key={team.id}
                                team={team}
                                index={index}
                                adminId={adminId}
                                myTeam={myTeam ?? null}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
}

export default LeagueClient;
