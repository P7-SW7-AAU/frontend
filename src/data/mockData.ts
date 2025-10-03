import { User, Team, League, Sport, SportsLeague, SportsTeam, PlayerWithTeam, TeamWithPlayers, LeagueWithTeams } from '@/types/database';

// Sports and Leagues
export const sport: Sport = {
  uniqueID: 'sport-1',
  name: 'Football'
};

export const sportsLeague: SportsLeague = {
  uniqueID: 'sports-league-1',
  name: 'National Football League',
  sport_ID: 'sport-1'
};

// NFL Teams
export const sportsTeams: SportsTeam[] = [
  { uniqueID: 'nfl-1', name: 'Buffalo Bills', sports_League_ID: 'sports-league-1' },
  { uniqueID: 'nfl-2', name: 'Miami Dolphins', sports_League_ID: 'sports-league-1' },
  { uniqueID: 'nfl-3', name: 'New England Patriots', sports_League_ID: 'sports-league-1' },
  { uniqueID: 'nfl-4', name: 'New York Jets', sports_League_ID: 'sports-league-1' },
  { uniqueID: 'nfl-5', name: 'Baltimore Ravens', sports_League_ID: 'sports-league-1' },
  { uniqueID: 'nfl-6', name: 'Cincinnati Bengals', sports_League_ID: 'sports-league-1' },
  { uniqueID: 'nfl-7', name: 'Cleveland Browns', sports_League_ID: 'sports-league-1' },
  { uniqueID: 'nfl-8', name: 'Pittsburgh Steelers', sports_League_ID: 'sports-league-1' },
];

// Users
export const users: User[] = [
  {
    uniqueID: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'hashed_password',
    image: undefined,
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

// Fantasy Teams
export const teams: Team[] = [
  {
    uniqueID: 'team-1',
    name: 'Gridiron Legends',
    user_ID: 'user-1',
    valueSum: 1247.5,
    playerCount: 3,
    createdAt: new Date('2024-08-01'),
    isActive: true
  },
  {
    uniqueID: 'team-2',
    name: 'Thunder Bolts',
    user_ID: 'user-2',
    valueSum: 1198.2,
    playerCount: 2,
    createdAt: new Date('2024-08-10'),
    isActive: true
  },
  {
    uniqueID: 'team-3',
    name: 'Steel Curtain',
    user_ID: 'user-3',
    valueSum: 1156.8,
    playerCount: 1,
    createdAt: new Date('2024-07-25'),
    isActive: true
  }
];

// League
export const league: League = {
  uniqueID: 'league-1',
  name: 'Championship League',
  type: 'private',
  createdAt: new Date('2024-08-01'),
  admin_ID: 'user-1',
  maxTeams: 12,
  sportType: 'single-sport' as const,
  allowedSports: ['sport-1']
};

// Players with extended data for UI
export const playersWithTeam: PlayerWithTeam[] = [
  {
    uniqueID: 'player-1',
    name: 'Josh Allen',
    value: 89.5,
    sports_Team_ID: 'nfl-1',
    status: 'active',
    position: 'QB',
    popularity: 95,
    team_ID: 'team-1',
    sportsTeam: sportsTeams[0],
    points: 324,
    projectedPoints: 28.5,
    trend: 'up'
  },
  {
    uniqueID: 'player-2',
    name: 'Tyreek Hill',
    value: 78.2,
    sports_Team_ID: 'nfl-2',
    status: 'active',
    position: 'WR',
    popularity: 88,
    team_ID: 'team-1',
    sportsTeam: sportsTeams[1],
    points: 198,
    projectedPoints: 22.1,
    trend: 'up'
  },
  {
    uniqueID: 'player-3',
    name: 'Christian McCaffrey',
    value: 85.1,
    sports_Team_ID: 'nfl-3',
    status: 'injured',
    position: 'RB',
    popularity: 92,
    team_ID: 'team-1',
    sportsTeam: sportsTeams[2],
    points: 156,
    projectedPoints: 0,
    trend: 'down'
  },
  {
    uniqueID: 'player-4',
    name: 'Lamar Jackson',
    value: 82.7,
    sports_Team_ID: 'nfl-5',
    status: 'active',
    position: 'QB',
    popularity: 91,
    team_ID: 'team-2',
    sportsTeam: sportsTeams[4],
    points: 289,
    projectedPoints: 26.8,
    trend: 'stable'
  },
  {
    uniqueID: 'player-5',
    name: 'Cooper Kupp',
    value: 76.3,
    sports_Team_ID: 'nfl-6',
    status: 'active',
    position: 'WR',
    popularity: 86,
    team_ID: 'team-2',
    sportsTeam: sportsTeams[5],
    points: 187,
    projectedPoints: 19.4,
    trend: 'up'
  },
  {
    uniqueID: 'player-6',
    name: 'T.J. Watt',
    value: 71.9,
    sports_Team_ID: 'nfl-8',
    status: 'bye',
    position: 'LB',
    popularity: 82,
    team_ID: 'team-3',
    sportsTeam: sportsTeams[7],
    points: 145,
    projectedPoints: 0,
    trend: 'stable'
  },
  // Available players (not owned)
  {
    uniqueID: 'player-7',
    name: 'DeAndre Hopkins',
    value: 68.4,
    sports_Team_ID: 'nfl-4',
    status: 'active',
    position: 'WR',
    popularity: 79,
    sportsTeam: sportsTeams[3],
    points: 134,
    projectedPoints: 15.8,
    trend: 'up'
  },
  {
    uniqueID: 'player-8',
    name: 'Nick Chubb',
    value: 73.6,
    sports_Team_ID: 'nfl-7',
    status: 'injured',
    position: 'RB',
    popularity: 84,
    sportsTeam: sportsTeams[6],
    points: 89,
    projectedPoints: 0,
    trend: 'down'
  }
];

// Teams with players and users
export const teamsWithPlayers: TeamWithPlayers[] = [
  {
    ...teams[0],
    players: playersWithTeam.filter(p => p.team_ID === 'team-1'),
    user: users[0]
  },
  {
    ...teams[1],
    players: playersWithTeam.filter(p => p.team_ID === 'team-2'),
    user: users[1]
  },
  {
    ...teams[2],
    players: playersWithTeam.filter(p => p.team_ID === 'team-3'),
    user: users[2]
  }
];

// League with teams
export const leagueWithTeams: LeagueWithTeams = {
  ...league,
  teams: teamsWithPlayers,
  admin: users[0]
};

// Available players (not owned by any team)
export const availablePlayers = playersWithTeam.filter(p => !p.team_ID);

// Helper function to get user's team
export const getCurrentUserTeam = (): TeamWithPlayers => teamsWithPlayers[0];

// Helper function to get league standings
export const getLeagueStandings = () => {
  return teamsWithPlayers
    .map(team => ({
      ...team,
      wins: Math.floor(Math.random() * 8) + 4,
      losses: Math.floor(Math.random() * 4) + 1,
      totalPoints: team.players.reduce((sum, player) => sum + (player.points || 0), 0),
      weeklyPoints: team.players.reduce((sum, player) => sum + (player.projectedPoints || 0), 0)
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((team, index) => ({ ...team, ranking: index + 1 }));
}
