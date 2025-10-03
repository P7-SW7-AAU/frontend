import { 
  User, 
  Team, 
  League, 
  TeamLeague,
  Sport, 
  SportsLeague, 
  SportsTeam, 
  PlayerWithTeam, 
  TeamWithPlayers, 
  LeagueWithTeams 
} from '@/types/database';

// Sports
export const sports: Sport[] = [
  { uniqueID: 'sport-1', name: 'American Football' },
  { uniqueID: 'sport-2', name: 'Basketball' },
  { uniqueID: 'sport-3', name: 'Soccer' },
  { uniqueID: 'sport-4', name: 'Chess' },
  { uniqueID: 'sport-5', name: 'Tennis' }
];

// Sports Leagues
export const sportsLeagues: SportsLeague[] = [
  { uniqueID: 'league-nfl', name: 'National Football League', sport_ID: 'sport-1' },
  { uniqueID: 'league-nba', name: 'National Basketball Association', sport_ID: 'sport-2' },
  { uniqueID: 'league-epl', name: 'English Premier League', sport_ID: 'sport-3' },
  { uniqueID: 'league-fide', name: 'FIDE World Rankings', sport_ID: 'sport-4' },
  { uniqueID: 'league-atp', name: 'ATP Tour', sport_ID: 'sport-5' }
];

// Sports Teams
export const sportsTeams: SportsTeam[] = [
  // NFL Teams
  { uniqueID: 'nfl-bills', name: 'Buffalo Bills', sports_League_ID: 'league-nfl' },
  { uniqueID: 'nfl-dolphins', name: 'Miami Dolphins', sports_League_ID: 'league-nfl' },
  { uniqueID: 'nfl-patriots', name: 'New England Patriots', sports_League_ID: 'league-nfl' },
  
  // NBA Teams
  { uniqueID: 'nba-lakers', name: 'Los Angeles Lakers', sports_League_ID: 'league-nba' },
  { uniqueID: 'nba-warriors', name: 'Golden State Warriors', sports_League_ID: 'league-nba' },
  { uniqueID: 'nba-celtics', name: 'Boston Celtics', sports_League_ID: 'league-nba' },
  
  // Soccer Teams
  { uniqueID: 'epl-city', name: 'Manchester City', sports_League_ID: 'league-epl' },
  { uniqueID: 'epl-arsenal', name: 'Arsenal', sports_League_ID: 'league-epl' },
  { uniqueID: 'epl-liverpool', name: 'Liverpool', sports_League_ID: 'league-epl' },
  
  // Chess (Individual sport - using countries/federations)
  { uniqueID: 'chess-norway', name: 'Norway Federation', sports_League_ID: 'league-fide' },
  { uniqueID: 'chess-usa', name: 'USA Federation', sports_League_ID: 'league-fide' },
  { uniqueID: 'chess-india', name: 'India Federation', sports_League_ID: 'league-fide' },
  
  // Tennis (Individual sport - using countries)
  { uniqueID: 'tennis-serbia', name: 'Serbia', sports_League_ID: 'league-atp' },
  { uniqueID: 'tennis-spain', name: 'Spain', sports_League_ID: 'league-atp' },
  { uniqueID: 'tennis-switzerland', name: 'Switzerland', sports_League_ID: 'league-atp' }
];

// Users
export const users: User[] = [
  {
    uniqueID: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'hashed_password',
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-09-28')
  },
  {
    uniqueID: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'hashed_password',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-09-27')
  },
  {
    uniqueID: 'user-3',
    name: 'Mike Davis',
    email: 'mike@example.com',
    password: 'hashed_password',
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-09-26')
  }
];

// Multi-sport Players
export const playersWithTeam: PlayerWithTeam[] = [
  // American Football Players
  {
    uniqueID: 'player-nfl-1',
    name: 'Josh Allen',
    value: 89.5,
    sports_Team_ID: 'nfl-bills',
    status: 'active',
    position: 'QB',
    popularity: 95,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'nfl-bills')!,
    points: 324,
    projectedPoints: 28.5,
    trend: 'up'
  },
  {
    uniqueID: 'player-nfl-2',
    name: 'Tyreek Hill',
    value: 78.2,
    sports_Team_ID: 'nfl-dolphins',
    status: 'active',
    position: 'WR',
    popularity: 88,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'nfl-dolphins')!,
    points: 198,
    projectedPoints: 22.1,
    trend: 'up'
  },
  {
    uniqueID: 'player-nfl-3',
    name: 'Christian McCaffrey',
    value: 85.1,
    sports_Team_ID: 'nfl-patriots',
    status: 'injured',
    position: 'RB',
    popularity: 92,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'nfl-patriots')!,
    points: 156,
    projectedPoints: 0,
    trend: 'down'
  },
  
  // Basketball Players
  {
    uniqueID: 'player-nba-1',
    name: 'LeBron James',
    value: 92.3,
    sports_Team_ID: 'nba-lakers',
    status: 'active',
    position: 'SF',
    popularity: 98,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'nba-lakers')!,
    points: 289,
    projectedPoints: 31.2,
    trend: 'up'
  },
  {
    uniqueID: 'player-nba-2',
    name: 'Stephen Curry',
    value: 88.7,
    sports_Team_ID: 'nba-warriors',
    status: 'active',
    position: 'PG',
    popularity: 96,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'nba-warriors')!,
    points: 267,
    projectedPoints: 29.8,
    trend: 'stable'
  },
  
  // Soccer Players
  {
    uniqueID: 'player-soccer-1',
    name: 'Erling Haaland',
    value: 85.9,
    sports_Team_ID: 'epl-city',
    status: 'active',
    position: 'ST',
    popularity: 94,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'epl-city')!,
    points: 245,
    projectedPoints: 26.4,
    trend: 'up'
  },
  {
    uniqueID: 'player-soccer-2',
    name: 'Bukayo Saka',
    value: 76.4,
    sports_Team_ID: 'epl-arsenal',
    status: 'active',
    position: 'RW',
    popularity: 87,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'epl-arsenal')!,
    points: 198,
    projectedPoints: 23.1,
    trend: 'up'
  },
  
  // Chess Players
  {
    uniqueID: 'player-chess-1',
    name: 'Magnus Carlsen',
    value: 95.0,
    sports_Team_ID: 'chess-norway',
    status: 'active',
    position: 'GM',
    popularity: 99,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'chess-norway')!,
    points: 312,
    projectedPoints: 35.2,
    trend: 'stable'
  },
  {
    uniqueID: 'player-chess-2',
    name: 'Hikaru Nakamura',
    value: 87.3,
    sports_Team_ID: 'chess-usa',
    status: 'active',
    position: 'GM',
    popularity: 93,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'chess-usa')!,
    points: 278,
    projectedPoints: 32.1,
    trend: 'up'
  },
  
  // Tennis Player
  {
    uniqueID: 'player-tennis-1',
    name: 'Novak Djokovic',
    value: 91.2,
    sports_Team_ID: 'tennis-serbia',
    status: 'active',
    position: 'ATP',
    popularity: 97,
    team_ID: 'team-1',
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'tennis-serbia')!,
    points: 301,
    projectedPoints: 33.7,
    trend: 'stable'
  },
  
  // Available Players (not owned by any team)
  {
    uniqueID: 'player-nfl-available-1',
    name: 'Patrick Mahomes',
    value: 93.1,
    sports_Team_ID: 'nfl-bills',
    status: 'active',
    position: 'QB',
    popularity: 97,
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'nfl-bills')!,
    points: 334,
    projectedPoints: 30.2,
    trend: 'up'
  },
  {
    uniqueID: 'player-nba-available-1',
    name: 'Jayson Tatum',
    value: 84.6,
    sports_Team_ID: 'nba-celtics',
    status: 'active',
    position: 'SF',
    popularity: 89,
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'nba-celtics')!,
    points: 256,
    projectedPoints: 27.9,
    trend: 'up'
  },
  {
    uniqueID: 'player-soccer-available-1',
    name: 'Mohamed Salah',
    value: 82.3,
    sports_Team_ID: 'epl-liverpool',
    status: 'active',
    position: 'RW',
    popularity: 91,
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'epl-liverpool')!,
    points: 223,
    projectedPoints: 25.6,
    trend: 'stable'
  },
  {
    uniqueID: 'player-tennis-available-1',
    name: 'Rafael Nadal',
    value: 89.7,
    sports_Team_ID: 'tennis-spain',
    status: 'injured',
    position: 'ATP',
    popularity: 95,
    sportsTeam: sportsTeams.find(t => t.uniqueID === 'tennis-spain')!,
    points: 189,
    projectedPoints: 0,
    trend: 'down'
  }
];

// Multiple Teams per User
export const teams: Team[] = [
  {
    uniqueID: 'team-1',
    name: 'Multi-Sport Legends',
    user_ID: 'user-1',
    valueSum: 1247.5,
    playerCount: 10,
    createdAt: new Date('2024-08-01'),
    isActive: true
  },
  {
    uniqueID: 'team-2',
    name: 'Global Dominators',
    user_ID: 'user-1', // Same user, different team
    valueSum: 985.2,
    playerCount: 8,
    createdAt: new Date('2024-08-15'),
    isActive: true
  },
  {
    uniqueID: 'team-3',
    name: 'Thunder Bolts',
    user_ID: 'user-2',
    valueSum: 1198.2,
    playerCount: 9,
    createdAt: new Date('2024-08-10'),
    isActive: true
  },
  {
    uniqueID: 'team-4',
    name: 'Steel Curtain',
    user_ID: 'user-3',
    valueSum: 1156.8,
    playerCount: 10,
    createdAt: new Date('2024-07-25'),
    isActive: true
  }
];

// Leagues
export const leagues: League[] = [
  {
    uniqueID: 'league-1',
    name: 'Championship Multi-Sport League',
    type: 'private',
    createdAt: new Date('2024-08-01'),
    admin_ID: 'user-1',
    maxTeams: 12,
    sportType: 'multi-sport',
    allowedSports: ['sport-1', 'sport-2', 'sport-3', 'sport-4', 'sport-5']
  },
  {
    uniqueID: 'league-2',
    name: 'Elite Global Competition',
    type: 'public',
    createdAt: new Date('2024-08-05'),
    admin_ID: 'user-2',
    maxTeams: 16,
    sportType: 'multi-sport',
    allowedSports: ['sport-1', 'sport-2', 'sport-3']
  }
];

// Team-League Relationships
export const teamLeagues: TeamLeague[] = [
  {
    uniqueID: 'tl-1',
    team_ID: 'team-1',
    league_ID: 'league-1',
    joinedAt: new Date('2024-08-01'),
    isActive: true
  },
  {
    uniqueID: 'tl-2',
    team_ID: 'team-3',
    league_ID: 'league-1',
    joinedAt: new Date('2024-08-10'),
    isActive: true
  },
  {
    uniqueID: 'tl-3',
    team_ID: 'team-4',
    league_ID: 'league-1',
    joinedAt: new Date('2024-08-12'),
    isActive: true
  },
  {
    uniqueID: 'tl-4',
    team_ID: 'team-2',
    league_ID: 'league-2',
    joinedAt: new Date('2024-08-15'),
    isActive: true
  }
];

// Helper functions
export const getCurrentUser = (): User => users[0];

export const getUserTeams = (userID: string = 'user-1'): TeamWithPlayers[] => {
  return teams
    .filter(team => team.user_ID === userID)
    .map(team => ({
      ...team,
      players: playersWithTeam.filter(p => p.team_ID === team.uniqueID),
      user: users.find(u => u.uniqueID === userID)
    }));
};

export const getCurrentUserTeam = (): TeamWithPlayers => getUserTeams()[0];

export const getAvailablePlayers = (): PlayerWithTeam[] => {
  return playersWithTeam.filter(p => !p.team_ID);
};

export const getLeagueById = (leagueID: string): LeagueWithTeams | undefined => {
  const league = leagues.find(l => l.uniqueID === leagueID);
  if (!league) return undefined;
  
  const leagueTeamIDs = teamLeagues
    .filter(tl => tl.league_ID === leagueID && tl.isActive)
    .map(tl => tl.team_ID);
  
  const leagueTeams = teams
    .filter(team => leagueTeamIDs.includes(team.uniqueID))
    .map(team => ({
      ...team,
      players: playersWithTeam.filter(p => p.team_ID === team.uniqueID),
      user: users.find(u => u.uniqueID === team.user_ID)
    }));
  
  return {
    ...league,
    teams: leagueTeams,
    admin: users.find(u => u.uniqueID === league.admin_ID)
  };
};

export const getLeagueStandings = (leagueID: string = 'league-1') => {
  const league = getLeagueById(leagueID);
  if (!league) return [];
  
  return league.teams
    .map(team => ({
      ...team,
      totalPoints: team.players.reduce((sum, player) => sum + (player.points || 0), 0),
      weeklyPoints: team.players.reduce((sum, player) => sum + (player.projectedPoints || 0), 0)
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((team, index) => ({ ...team, ranking: index + 1 }));
};

export const getPlayersBySport = (sportID: string): PlayerWithTeam[] => {
  const sportLeagueIDs = sportsLeagues
    .filter(sl => sl.sport_ID === sportID)
    .map(sl => sl.uniqueID);
  
  const sportTeamIDs = sportsTeams
    .filter(st => sportLeagueIDs.includes(st.sports_League_ID))
    .map(st => st.uniqueID);
  
  return playersWithTeam.filter(p => sportTeamIDs.includes(p.sports_Team_ID));
};

// Constants
export const MAX_PLAYERS_PER_TEAM = 10;
