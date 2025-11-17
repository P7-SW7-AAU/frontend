"use client";

import Header from '@/components/Header';

import { Player } from '@/types';
import Container from '@/components/Container';
import PlayerCardDetailed from '@/components/PlayerCardDetailed';
import { useRouter } from 'next/navigation';

interface PlayersClientProps {
    players: Player[];
}

const PlayersClient = ({ players }: PlayersClientProps) => {
    const router = useRouter();
    
    return (
        <Container>
             <Header
                title={"Players"}
                description="Browse all available players"
            />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Top Performers</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players
                        .slice()
                        .sort((a, b) => (b.price + b.weekPriceChange) - (a.price + a.weekPriceChange))
                        .slice(0, 6)
                        .map((player) => (
                            <PlayerCardDetailed 
                                key={player.id}
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
                    <h2 className="text-2xl font-bold text-white">Football Players</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.filter(player => player.sport === "FOOTBALL").map((player) => (
                        <PlayerCardDetailed 
                            key={player.id}
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
                    <h2 className="text-2xl font-bold text-white">NBA Players</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.filter(player => player.sport === "NBA").map((player) => (
                        <PlayerCardDetailed 
                            key={player.id}
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
                    <h2 className="text-2xl font-bold text-white">F1 Players</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.filter(player => player.sport === "F1").map((player) => (
                        <PlayerCardDetailed 
                            key={player.id}
                            player={player}
                            isOwned={false}
                            onAdd={() => router.push('/teams/lineup')}
                            onRemove={() => {}}
                        />
                    ))}
                </div>
            </div>
        </Container>
    );
}

export default PlayersClient;
