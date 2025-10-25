"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, Trophy, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Team = any;

type TeamProps = {
    team: Team;
    onEdit: () => void;
    onDelete: () => void;
    onManage: (teamID: string) => void;
};

const TeamCard = ({ team, onEdit, onDelete, onManage }: TeamProps) => {
    const router = useRouter();

    const getTeamStats = (team: any) => {
        const totalPoints = team.players.reduce((sum: number, player: any) => sum + (player.points || 0), 0);
        const projectedPoints = team.players.reduce((sum: number, player: any) => sum + (player.projectedPoints || 0), 0);

        // Group players by sport
        const sportGroups = team.players.reduce((groups: any, player: any) => {
            const sportName = player.sportsTeam?.sports_League_ID?.includes('nfl') ? 'Football' :
                                player.sportsTeam?.sports_League_ID?.includes('nba') ? 'Basketball' :
                                player.sportsTeam?.sports_League_ID?.includes('epl') ? 'Soccer' :
                                player.sportsTeam?.sports_League_ID?.includes('chess') ? 'Chess' : 'Tennis';

            if (!groups[sportName]) groups[sportName] = 0;
            groups[sportName]++;
            return groups;
        }, {});

        return { 
            totalPoints, projectedPoints, sportGroups 
        }
    }

    const stats = getTeamStats(team);

    return (
        <Card className="hover:shadow-card transition-smooth">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <CardTitle className="text-xl text-white">{team.name}</CardTitle>
                        <div className="flex items-center space-x-4">
                            <Badge
                                variant="secondary"
                                className="px-2 py-1"
                            >
                                {team.playerCount}/10 Players
                            </Badge>
                            <Badge variant="outline" className="px-2 py-1">
                                ${team.valueSum}M Value
                            </Badge>
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

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-primary-gray">Total Points</div>
                        <div className="text-lg font-semibold text-white">
                            {stats.totalPoints.toLocaleString()}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-primary-gray">Projected</div>
                        <div className="text-lg font-semibold text-primary-green">
                            {stats.projectedPoints.toFixed(1)}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3 pt-2">
                    <Button
                        variant="hero"
                        className="flex-1"
                        onClick={() => onManage(team.uniqueID)}
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
                        View Leagues
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default TeamCard;
