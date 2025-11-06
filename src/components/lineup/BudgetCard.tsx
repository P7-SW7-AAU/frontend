import { DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface BudgetCardProps {
    teamBudget: number;
    maxPlayersPerTeam: number;
    selectedTeamId: string;
    getRemainingBudget: (teamId: string) => number;
    getBudgetSpent: (teamId: string) => number;
    getRemainingSlots: (teamId: string) => number;
    getDraftedCount: (teamId: string) => number;
}

const BudgetCard = ({ teamBudget, maxPlayersPerTeam, getRemainingBudget, getBudgetSpent, getRemainingSlots, getDraftedCount, selectedTeamId }: BudgetCardProps) => {
    return (
        <Card className="border-[#16A149] bg-[#152323]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-2xl font-bold">
                    <DollarSign className="h-5 w-5 text-white" />
                    Team Budget & Slots
                </CardTitle>
                <CardDescription className="text-primary-gray font-medium">Manage your resources wisely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-primary-gray">Budget Remaining</span>
                        <span className="text-2xl font-bold text-white">
                            ${getRemainingBudget(selectedTeamId).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M
                        </span>
                    </div>
                    <Progress 
                        value={(getRemainingBudget(selectedTeamId) / teamBudget) * 100} 
                        className="h-3"
                    />
                    <p className="text-xs text-primary-gray font-medium mt-1">
                        ${getBudgetSpent(selectedTeamId).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / ${teamBudget.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} spent
                    </p>
                </div>
              
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-primary-gray">Team Slots</span>
                        <span className="text-2xl font-bold text-white">
                            {getRemainingSlots(selectedTeamId)} / {maxPlayersPerTeam}
                        </span>
                    </div>
                    <Progress 
                        value={(getRemainingSlots(selectedTeamId) / maxPlayersPerTeam) * 100} 
                        className="h-3"
                    />
                    <p className="text-xs text-primary-gray font-medium mt-1">
                        {getDraftedCount(selectedTeamId)} added this session
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default BudgetCard;
