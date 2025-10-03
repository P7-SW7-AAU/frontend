"use client"

import Navigation from '@/components/Navbar';
import TeamStats from '@/components/TeamStats';
import PlayerCard from '@/components/PlayerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Trophy, Target, Calendar } from 'lucide-react';
import { useRouter } from "next/navigation";
import { getCurrentUserTeam, getAvailablePlayers, getLeagueStandings } from '@/data/multiSportMockData';
import { PlayerWithTeam } from '@/types/database';

const Dashboard = () => {
  const router = useRouter();
  const currentTeam = getCurrentUserTeam();
  const standings = getLeagueStandings();
  const currentStanding = standings.find(s => s.uniqueID === currentTeam.uniqueID);
  const availablePlayers = getAvailablePlayers();

  const handlePlayerAction = (player: PlayerWithTeam, action: 'add' | 'drop') => {
    console.log(`${action} player:`, player.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/fantasy-hero.jpg)` }}
        >
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Multi-Sport Fantasy
              <span className="block text-[#1B8143] animate-pulse-glow">Command Center</span>
            </h1>
            <p className="text-xl font-medium text-[#94A4B8] max-w-2xl mx-auto">
              Build teams with players from football, basketball, soccer, chess, tennis and more. Dominate across all sports!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="animate-float-continuous"
                onClick={() => router.push('/teams')}
              >
                <Users className="h-5 w-5 mr-2" />
                Manage Teams
              </Button>
              <Button 
                variant="gold" 
                size="lg"
                onClick={() => router.push('/players')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Browse Players
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Team Overview */}
        <TeamStats
          team={currentTeam}
          totalPoints={currentStanding?.totalPoints || 0}
          weeklyPoints={currentStanding?.weeklyPoints || 0}
          ranking={currentStanding?.ranking || 1}
          totalTeams={standings.length}
          projectedPoints={currentStanding?.weeklyPoints || 0}
        />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-card transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Users className="h-5 w-5 mr-2 text-[#16A149]" />
                League Standings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A4B8] font-medium mb-4">Check your position in the league</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/leagues')}
              >
                View Leagues
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Target className="h-5 w-5 mr-2 text-[#16A149]" />
                Waiver Wire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A4B8] font-medium mb-4">Find hidden gems for your roster</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/players')}
              >
                Browse Players
              </Button>
            </CardContent>
          </Card>

          {/* <Card className="hover:shadow-card transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-white">
                <Calendar className="h-5 w-5 mr-2 text-gold" />
                Upcoming Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A4B8] font-medium mb-4">Plan your lineup strategy</p>
              <Button variant="outline" className="w-full">View Schedule</Button>
            </CardContent>
          </Card> */}
        </div>

        {/* Top Performers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Top Performers</h2>
            <Badge variant="secondary" className="px-3 py-1">This Week</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {currentTeam.players.slice(0, 3).map((player) => (
              <PlayerCard
                key={player.uniqueID}
                player={player}
                onAction={handlePlayerAction}
              />
            ))}
          </div>
        </div>

        {/* Available Players */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Trending Players</h2>
            <Button 
              variant="ghost"
              onClick={() => router.push('/players')}
            >
              View All
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlayers.slice(0, 3).map((player) => (
              <PlayerCard
                key={player.uniqueID}
                player={player}
                onAction={handlePlayerAction}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
