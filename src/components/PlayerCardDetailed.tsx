import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { PlayerWithTeam } from '@/types/database';

interface PlayerCardDetailedProps {
  player: PlayerWithTeam;
  isOwned: boolean;
  onAdd: () => void;
  onRemove: () => void;
  getTrendIcon: (trend?: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  disabled?: boolean;
}

const PlayerCardDetailed = ({
  player,
  isOwned,
  onAdd,
  onRemove,
  getTrendIcon,
  getStatusColor,
  disabled,
}: PlayerCardDetailedProps) => (
  <div className="hover:shadow-elegant border border-[#1E2938] hover:border-[#16A149] transition-all hover:-translate-y-1 group rounded-xl bg-card">
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 group-hover:scale-110 transition-transform">
            <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold">
              {player.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">{player.name}</h3>
            <p className="text-sm text-primary-gray font-medium">{player.position}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {getTrendIcon(player.trend)}
          <Badge variant="secondary" className="text-xs font-bold">
            ${player.value}M
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-4 bg-[#131C25] rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-gray font-medium">Team</span>
          <span className="font-bold text-white text-xs">{player.sportsTeam.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-gray font-medium">Points</span>
          <span className="font-bold text-primary-green">{player.points}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-gray font-medium">Projected</span>
          <span className="font-bold text-white">{player.projectedPoints}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant={getStatusColor(player.status) as "default" | "destructive" | "outline" | "secondary" | undefined} className="text-xs font-bold">
          {player.status.toUpperCase()}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {player.popularity}% owned
        </Badge>
      </div>

      {isOwned ? (
        <Button
          className="w-full hover:scale-105 transition-transform"
          size="sm"
          variant="destructive"
          onClick={onRemove}
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Remove from Team
        </Button>
      ) : (
        <Button
          className="w-full hover:scale-105 transition-transform"
          size="sm"
          variant="hero"
          onClick={onAdd}
          disabled={disabled}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {disabled ? 'Unavailable' : 'Add Player'}
        </Button>
      )}
    </div>
  </div>
);

export default PlayerCardDetailed;
