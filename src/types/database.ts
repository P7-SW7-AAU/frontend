export interface User {
  uniqueID: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  uniqueID: string;
  name: string;
  user_ID: string;
  valueSum: number;
  playerCount: number; // Track current number of players (max 10)
  createdAt: Date;
  isActive: boolean;
}

export interface League {
  uniqueID: string;
  name: string;
  type: 'public' | 'private';
  createdAt: Date;
  password?: string;
  admin_ID: string;
  maxTeams: number;
  sportType: 'multi-sport' | 'single-sport';
  allowedSports?: string[]; // sport IDs allowed in this league
}

// Junction table for team-league relationships (many-to-many)
export interface TeamLeague {
  uniqueID: string;
  team_ID: string;
  league_ID: string;
  joinedAt: Date;
  isActive: boolean;
}

export interface Sport {
  uniqueID: string;
  name: string;
}

export interface SportsLeague {
  uniqueID: string;
  name: string;
  sport_ID: string;
}

export interface SportsTeam {
  uniqueID: string;
  name: string;
  sports_League_ID: string;
}

export interface Player {
  uniqueID: string;
  name: string;
  value: number;
  sports_Team_ID: string;
  status: 'active' | 'injured' | 'bye';
  position: string;
  popularity: number;
  team_ID?: string; // Optional - only if owned by a fantasy team
  // Computed/joined fields for UI
  sportsTeam?: SportsTeam;
  points?: number;
  projectedPoints?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface DataAPI {
  uniqueID: string;
  sport_ID: string;
  endpoint: string;
}

// Extended interfaces for UI display with joined data
export interface PlayerWithTeam extends Player {
  sportsTeam: SportsTeam;
  points: number;
  projectedPoints: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TeamWithPlayers extends Team {
  players: PlayerWithTeam[];
  user?: User;
}

export interface LeagueWithTeams extends League {
  teams: TeamWithPlayers[];
  admin?: User;
}
