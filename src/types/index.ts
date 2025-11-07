export type Player = {
    id: number;
    sport: string;
    name: string;
    position: string;
    popularity: number;
    points: number;
    projectedPoints: number;
    firstname?: string;
    lastname?: string;
    nationality?: string;
    teamId?: string;
    sportsTeam?: string;
    tradeLockedWeek?: string;
    price: number;
    weekPriceChange: number;
    logo?: string;
    teamName?: string;
}

export type Team = {
    id: string;
    name: string;
    roster: Player[];
    logo?: string;
}