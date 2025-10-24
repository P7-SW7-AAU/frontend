// TODO: Add eye icon and leave buttons
"use client";

import { Trophy, Eye, DoorOpen, Target } from 'lucide-react';

import CardStats from '@/components/CardStats';
import Container from '@/components/Container';
import Header from '@/components/Header';
import CardLeaderboard from '@/components/leaderboard/CardLeaderboard';

import { useLeaveLeagueModal } from '@/hooks/useLeaveLeagueModal';

import { getLeagueStandings, leagueWithTeams } from '@/data/mockData';

const LeagueClient = () => {
    const standings = getLeagueStandings();
    const leaveLeagueModal = useLeaveLeagueModal();

    return (
        <Container>
            <Header
                title={leagueWithTeams.name}
                description="Track the performance of all teams in the league"
                buttonText="Leave League"
                buttonIcon={DoorOpen}
                buttonIconSize="4"
                onClick={leaveLeagueModal.onOpen}
                secondaryButtonText="View Code"
                secondaryButtonIcon={Eye}
                secondaryButtonIconSize="4"
                secondaryOnClick={() => {}}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <CardStats 
                    title="Week" 
                    value={5} 
                    valueColor="text-white" 
                    description={`in ${leagueWithTeams.name}`}
                    icon={Trophy} 
                    iconColor="text-primary-green" 
                />

                <CardStats 
                    title="Total Points" 
                    value={standings[0].totalPoints} 
                    valueColor="text-primary-green" 
                    description="in this league" 
                    icon={Target} 
                    iconColor="text-primary-green" 
                />

                <CardStats 
                    title="Weekly Points" 
                    value={standings[0].weeklyPoints} 
                    valueColor="text-white" 
                    description="in this league" 
                    icon={Target} 
                    iconColor="text-primary-gray" 
                />

                <CardStats 
                    title="Best Rank" 
                    value={`#${standings[0].ranking}`} 
                    valueColor="text-primary-yellow" 
                    description="highest position" 
                    icon={Target} 
                    iconColor="text-primary-yellow" 
                />
            </div>

            <div className="space-y-6 mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <Trophy className="h-6 w-6 mr-2 text-primary-yellow" />
                    Leaderboard
                </h2>
                <CardLeaderboard standings={standings} />
            </div>
        </Container>
    );
}

export default LeagueClient;
