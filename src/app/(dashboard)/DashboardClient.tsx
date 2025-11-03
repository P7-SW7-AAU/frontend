"use client";

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Target, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAvailablePlayers } from '@/data/multiSportMockData';
import { useUser } from '@stackframe/stack';
import Banner from '@/components/dashboard/Banner';
import ShortcutCard from '@/components/dashboard/ShortcutCard';
import PlayerCardDetailed from '@/components/PlayerCardDetailed';

import { Player } from '@/types';

interface DashboardClientProps {
    players: Player[];
}

const DashboardClient = ({ players }: DashboardClientProps) => {
    const router = useRouter();
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

    const getTrendIcon = (trend?: string) => {
        if (trend === 'up') return <TrendingUp className="h-3 w-3 text-primary-green" />;
        if (trend === 'down') return <TrendingDown className="h-3 w-3 text-destructive" />;
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'injured': return 'destructive';
            case 'bye': return 'secondary';
            default: return 'outline';
        }
    }

    const handlePlayerAction = () => {
        // TODO: If user has no teams, redirect to create team page
        router.push('/teams/lineup');
    }

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
                    {players.slice(0, 3).map((player) => (
                        <PlayerCardDetailed 
                            key={player.id}
                            player={player}
                            isOwned={false}
                            onAdd={handlePlayerAction}
                            onRemove={() => {}}
                            getTrendIcon={getTrendIcon}
                            getStatusColor={getStatusColor}
                        />
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
                    {players.slice(3, 6).map((player) => (
                        <PlayerCardDetailed 
                            key={player.id}
                            player={player}
                            isOwned={false}
                            onAdd={handlePlayerAction}
                            onRemove={() => {}}
                            getTrendIcon={getTrendIcon}
                            getStatusColor={getStatusColor}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}

export default DashboardClient;
