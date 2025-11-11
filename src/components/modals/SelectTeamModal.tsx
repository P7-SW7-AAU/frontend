// TODO (future enhancement): Support assigning a team to multiple leagues. 
// The current implementation only allows a single league per team, which is intentional for now.

"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { useSelectTeamModal } from "@/hooks/useSelectTeam";

import Modal from "./Modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { Team } from "@/types";
import { removeLeagueId, updateTeam } from "@/services/teamsService";

interface SelectTeamModalProps {
    leagueId: string | null;
    selectedTeam?: { id: string } | null;
    teams: Team[];
}

const SelectTeamModal = ({ leagueId, selectedTeam, teams }: SelectTeamModalProps) => {
    const { api } = useApi();
    const router = useRouter();
    const selectTeamModal = useSelectTeamModal();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(selectedTeam?.id);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async () => {
        if (!selectedTeamId) {
            setError("Please select a team.");
            toast.error("Please select a team.");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            // If changing teams, remove previous team from league
            if (selectedTeam?.id && selectedTeam?.id !== selectedTeamId) {
                await removeLeagueId(selectedTeam.id, api);
            }
            await updateTeam(selectedTeamId, { leagueId }, api);
            toast.success("Team updated successfully!");
            selectTeamModal.onClose();
            router.refresh();
        } catch (error: any) {
            toast.error("Failed to update team: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        setSelectedTeamId(selectedTeam?.id);
    }, [selectedTeam]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Select Team
            </span>
            <Select
                value={selectedTeamId}
                onValueChange={(value) => {
                    setSelectedTeamId(value);
                    if (error) setError(null);
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                    {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                            <div className="flex items-center gap-2">
                                <span className="text-white group-hover:text-black group-focus:text-black font-semibold">
                                    {team.name}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );

    return (
        <Modal
            isOpen={selectTeamModal.isOpen}
            onClose={selectTeamModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
            actionLabel="Save"
            disabled={isLoading}
        />
    );
}

export default SelectTeamModal;
