export type Player = {
    id: number;
    sport: string;
    name: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    status: 'active' | 'injured';
    position: string;
    popularity: number;
    points: number;
    projectedPoints: number;
    firstname?: string;
    lastname?: string;
    nationality?: string;
    teamId?: string;
    sportsTeam?: string;
}

export type Team = {
    id: string;
    name: string;
    players: Player[];
}