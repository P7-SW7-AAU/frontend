"use client";

import Navbar from '@/components/Navbar';
import PlayerCard from '@/components/PlayerCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Target, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getCurrentUserTeam, getAvailablePlayers } from '@/data/multiSportMockData';
import { PlayerWithTeam } from '@/types/database';
import { useUser } from '@stackframe/stack';
import Banner from '@/components/dashboard/Banner';
import ShortcutCard from '@/components/dashboard/ShortcutCard';

const DashboardClient = () => {
  const router = useRouter();
  const currentTeam = getCurrentUserTeam();
  const availablePlayers = getAvailablePlayers();

  // -- ONLY FOR GETTING TOKEN FOR TESTING ENDPOINTS! REMOVE LATER AS WE USE A BETTER APPROACH GETTING TOKEN --
  const user = useUser();
  useEffect(() => {
    (async () => {
      if (!user) return;
      const { accessToken } = await user.getAuthJson(); // ← correct API
      console.log('Access token:', accessToken);
    })();
  }, [user]);
  // -- REMOVE ABOVE --

    const handlePlayerAction = (player: PlayerWithTeam, action: 'add' | 'drop') => {
        router.push('/teams/lineup');
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <Banner
                title="Multi-Sport Fantasy"
                description="Build teams with players from football, basketball, soccer, chess, tennis and more. Dominate across all sports!"
                onClick={() => router.push('/teams')}
                onSecondaryClick={() => router.push('/players')}
            />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div className="grid md:grid-cols-3 gap-6">
                <ShortcutCard 
                    title="Manage Teams"
                    description="View and edit your fantasy teams"
                    buttonText="Go to Teams"
                    onClick={() => router.push('/teams')}
                    icon={Trophy}
                />

                <ShortcutCard 
                    title="League Standings"
                    description="Check your position in the league"
                    buttonText="Go to Leagues"
                    onClick={() => router.push('/leagues')}
                    icon={Users}
                />

                <ShortcutCard 
                    title="Waiver Wire"
                    description="Find hidden gems for your team"
                    buttonText="Browse Players"
                    onClick={() => router.push('/players')}
                    icon={Target}
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Top Performers</h2>
                    <Badge variant="secondary" className="px-3 py-1">This Week</Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {currentTeam.players.slice(0, 3).map((player) => (
                        <PlayerCard key={player.uniqueID} player={player} onAction={handlePlayerAction} />
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Trending Players</h2>
                    <Button
                        onClick={() => router.push('/players')}
                        className="text-white font-bold hover:scale-105 transition-all duration-200"
                    >
                        View All
                        <Plus className="h-4 w-4 ml-2" />
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availablePlayers.slice(0, 3).map((player) => (
                        <PlayerCard key={player.uniqueID} player={player} onAction={handlePlayerAction} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}

export default DashboardClient;
