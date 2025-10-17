// TODO: Add eye icon and leave buttons
"use client";

import { Trophy, TrendingUp, TrendingDown, Crown, Eye, DoorOpen, Target } from 'lucide-react';

import CardStats from '@/components/CardStats';
import Navbar from '@/components/Navbar';
import CardLeaderboard from '@/components/leaderboard/CardLeaderboard';

import { Button } from '@/components/ui/button';

import { useLeaveLeagueModal } from '@/hooks/useLeaveLeagueModal';

import { getLeagueStandings, leagueWithTeams } from '@/data/mockData';

const LeagueClient = () => {
  const standings = getLeagueStandings();
  const leaveLeagueModal = useLeaveLeagueModal();

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-gold" />;
    if (rank <= 3) return <Trophy className="h-4 w-4 text-bronze" />;
    return null;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-field-green" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return null;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const topTeam = standings[0];
  const averageScore = standings.reduce((sum, t) => sum + t.totalPoints, 0) / standings.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-white">{leagueWithTeams.name}</h1>
                    <p className="text-primary-gray font-medium mt-1">
                        Track the performance of all teams in the league
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" size="lg" onClick={() => {}}>
                        <Eye className="h-4 w-4" />
                        View Code
                    </Button>
                    <Button variant="hero" size="lg" onClick={leaveLeagueModal.onOpen}>
                        <DoorOpen className="h-4 w-4" />
                        Leave League
                    </Button>
                </div>
            </div>

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
                    title="Total Score" 
                    value={standings[0].totalPoints} 
                    valueColor="text-primary-green" 
                    description="in this league" 
                    icon={Target} 
                    iconColor="text-primary-green" 
                />

                <CardStats 
                    title="Weekly Score" 
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
        </div>
    </div>
  );
}

export default LeagueClient;
