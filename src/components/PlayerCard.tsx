import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import { PlayerWithTeam } from '@/types/database';

interface PlayerCardProps {
  player: PlayerWithTeam;
  onAction?: (player: PlayerWithTeam, action: 'add' | 'drop') => void;
  compact?: boolean;
  isOwned?: boolean;
}

const PlayerCard = ({ player, onAction, compact = false, isOwned = !!player.team_ID }: PlayerCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'injured':
        return 'destructive';
      case 'bye':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTrendIcon = () => {
    if (player.trend === 'up') return <TrendingUp className="h-4 w-4 text-primary-green" />;
    if (player.trend === 'down') return <TrendingDown className="h-4 w-4 text-primary-red" />;
    return null;
  };

  return (
    <Card className="hover:shadow-card transition-smooth hover:scale-[1.02] bg-card">
      <CardHeader className={`pb-3 ${compact ? 'p-4' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>
              {player.name}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {player.position}
              </Badge>
              <span className={`text-white ${compact ? 'text-xs' : 'text-sm'}`}>
                {player.sportsTeam.name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <Badge variant={getStatusColor(player.status)} className="text-xs font-bold">
              {player.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`pt-0 ${compact ? 'p-4 pt-0' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className={`text-white font-medium ${compact ? 'text-sm' : 'text-base'}`}>
              {player.points || 0} pts
            </div>
            <div className={`text-primary-gray font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
              Proj: {player.projectedPoints || 0}
            </div>
            <div className={`text-primary-gray font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
              Value: ${player.value}M
            </div>
          </div>
          
          {onAction && (
            <Button
              size="sm"
              variant={isOwned ? "destructive" : "hero"}
              onClick={() => onAction(player, isOwned ? 'drop' : 'add')}
              className="ml-4"
            >
              {isOwned ? (
                <>
                  <Minus className="h-4 w-4 mr-1 text-white" />
                  Drop
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1 text-white" />
                  Add
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PlayerCard;
