"use client";

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Target, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Banner from '@/components/dashboard/Banner';
import ShortcutCard from '@/components/dashboard/ShortcutCard';
import PlayerCardDetailed from '@/components/PlayerCardDetailed';

import { Player } from '@/types';

import { useUser } from '@stackframe/stack';
import { useEffect } from 'react';

interface DashboardClientProps {
    players: Player[];
}

const DashboardClient = ({ players }: DashboardClientProps) => {
    const router = useRouter();

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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <Banner
                title="Fantasy Arena"
                description="Build teams with players from basketball, soccer and F1. Dominate across all sports!"
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
                    {players
                        .slice()
                        .sort((a, b) => (b.price + b.weekPriceChange) - (a.price + a.weekPriceChange))
                        .slice(0, 3)
                        .map((player) => (
                            <PlayerCardDetailed 
                                key={player.id + '-' + player.sport}
                                player={player}
                                isOwned={false}
                                onAdd={() => router.push('/teams/lineup')}
                                onRemove={() => {}}
                            />
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Trending Players</h2>
                    <Button
                        onClick={() => router.push('/players')}
                        className="text-white font-bold hover:scale-105 transition-all duration-200 p-0 bg-transparent hover:bg-transparent"
                    >
                        View All
                        <Plus className="h-4 w-4 ml-2" />
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.slice(3, 6).map((player) => (
                        <PlayerCardDetailed 
                            key={player.id + '-' + player.sport}
                            player={player}
                            isOwned={false}
                            onAdd={() => router.push('/teams/lineup')}
                            onRemove={() => {}}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}

export default DashboardClient;
