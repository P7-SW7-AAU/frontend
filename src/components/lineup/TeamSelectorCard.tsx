import { Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";

interface TeamSelectorCardProps {
    selectedTeamId: string;
    handleTeamChange: (teamId: string) => void;
    userTeams: any[];
}

const TeamSelectorCard = ({ selectedTeamId, handleTeamChange, userTeams }: TeamSelectorCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-white font-bold">
                    <Target className="h-5 w-5 text-primary-green" />
                    Select Your Team
                </CardTitle>
                <CardDescription className="text-primary-gray font-medium">Choose which team to modify your lineup for</CardDescription>
            </CardHeader>
            <CardContent>
                <Select value={selectedTeamId} onValueChange={handleTeamChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                        {userTeams.map(team => (
                            <SelectItem key={team.uniqueID} value={team.uniqueID}>
                                <div className="flex items-center gap-2">
                                    <span className="text-white group-hover:text-black group-focus:text-black font-semibold">{team.name}</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {team.playerCount} players
                                    </Badge>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    );
}

export default TeamSelectorCard;
