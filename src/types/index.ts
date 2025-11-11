export type UserProfile = {
    id: string;
    displayName?: string;
    createdAt: Date;
    leagues: League[];
    memberShips: LeagueMember[];
    teamsOwned: Team[];
}

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
    leagueId?: string;
    ownerId: string;
    teamValue: number;
    bank: number;
    roster: Player[];
    logo?: string;
}

export type League = {
    id: string;
    name: string;
    commissionerId: string;
    createdAt: string;
    joinCode: string;
    joinOpen: boolean;
    joinExpiresAt?: Date;
    maxTeams: number;
    commissioner: UserProfile;
    members: LeagueMember[];
    counts: any;
    teams: Team[];
}

export type LeagueMember = {
    leagueId: string;
    userId: string;
    role: "ADMIN" | "MEMBER";
    league: League;
    user: UserProfile;
}
