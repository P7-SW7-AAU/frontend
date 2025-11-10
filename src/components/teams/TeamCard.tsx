"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, Trophy, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Team } from '@/types';

type TeamProps = {
    team: Team;
    onEdit: () => void;
    onDelete: () => void;
    onManage: (teamID: string) => void;
}

const TeamCard = ({ team, onEdit, onDelete, onManage }: TeamProps) => {
    const router = useRouter();

    const getTeamStats = (team: Team) => {

        // Group players by sport
        const sportGroups = team.roster.reduce((groups: any, player: any) => {
            const sportName = player.sport?.includes('FOOTBALL') ? 'Football' :
                                player.sport?.includes('F1') ? 'Formula 1' :
                                player.sport?.includes('NBA') ? 'NBA' : 'Other';

            if (!groups[sportName]) groups[sportName] = 0;
            groups[sportName]++;
            return groups;
        }, {});

        return { 
            sportGroups 
        }
    }

    const stats = getTeamStats(team);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <CardTitle className="text-xl text-white">{team.name}</CardTitle>
                        <div className="flex items-center space-x-4">
                            <Badge
                                variant="secondary"
                                className="px-2 py-1"
                            >
                                10/10 Players
                            </Badge>
                            {/* <Badge variant="outline" className="px-2 py-1">
                                ${team.players.map(player => player.value).reduce((acc, val) => acc + val, 0)}M Value
                            </Badge> */}
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={onEdit}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="trash" onClick={onDelete}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-primary-gray">Sports Breakdown</h4>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(stats.sportGroups).map(([sport, count]) => (
                            <Badge key={sport} variant="secondary">
                                {sport}: {count as number}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1E2938]">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-primary-gray">Total Value</div>
                        <div className="text-lg font-semibold text-primary-yellow">
                            {(() => {
                                const value = team.roster.map(player => player.price).reduce((acc, price) => acc + price, 0) / 1_000_000;
                                // Remove trailing zeros but keep up to 6 decimals, add thousand separators
                                let formatted = value.toFixed(6).replace(/\.?0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
                                // Add thousand separators
                                if (formatted.includes('.')) {
                                    const [intPart, decPart] = formatted.split('.');
                                    formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decPart;
                                } else {
                                    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                }
                                return `$${formatted}M`;
                            })()}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-primary-gray">
                            Weekly Price Change
                        </div>
                        {(() => {
                            const totalChange = team.roster.map(player => player.weekPriceChange).reduce((acc, price) => acc + price, 0);
                            const color = totalChange > 0 ? 'text-primary-green' : totalChange < 0 ? 'text-primary-red' : 'text-primary-gray';
                            return (
                                <div className={`text-lg font-semibold ${color}`}>
                                    {totalChange === 0 ? '—' : (() => {
                                        const value = totalChange / 1_000;
                                        // Remove trailing zeros but keep up to 3 decimals, add thousand separators
                                        let formatted = value.toFixed(3).replace(/\.?0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
                                        if (formatted.includes('.')) {
                                            const [intPart, decPart] = formatted.split('.');
                                            formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decPart;
                                        } else {
                                            formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        }
                                        return `${totalChange > 0 ? '+' : ''}$${formatted}K`;
                                    })()}
                                </div>
                            );
                        })()}
                    </div>
                </div>

                <div className="flex space-x-3 pt-2">
                    <Button
                        variant="hero"
                        className="flex-1"
                        onClick={() => onManage(team.id)}
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Manage Team
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => router.push("/leagues")}
                    >
                        <Trophy className="h-4 w-4 mr-2" />
                        My Leagues
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default TeamCard;
