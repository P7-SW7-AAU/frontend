"use client";

import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { useLeaveLeagueModal } from "@/hooks/useLeaveLeagueModal";

import Modal from "./Modal";

import { deleteLeagueMember } from "@/services/leagueMembersService";
import { updateTeam } from "@/services/teamsService";

interface LeaveLeagueModalProps {
    leagueId: string | null;
    teamId: string | null;
    userId: string | null;
}

const LeaveLeagueModal = ({ leagueId, teamId, userId }: LeaveLeagueModalProps) => {
    const { api } = useApi();
    const router = useRouter();
    const leaveLeagueModal = useLeaveLeagueModal();
    const [isLoading, setIsLoading] = useState(false);

    const onLeave = useCallback(() => {
        if (!leagueId) {
            toast.error("No league selected for leaving.");
            return;
        }

        setIsLoading(true);

        updateTeam(teamId || "", { leagueId: null }, api);

        deleteLeagueMember(leagueId, userId || "")
            .then(() => {
                toast.success("Left league successfully!");
                leaveLeagueModal.onClose();
                router.push("/leagues");
            })
            .catch((error) => {
                toast.error("Failed to leave league: " + error.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [leagueId, userId, teamId, api, router, leaveLeagueModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Leave League
            </span>
            <p className="flex items-center justify-center text-primary-gray text-medium font-medium">
                You can always rejoin later
            </p>
        </div>
    );

    return (
        <Modal 
            isOpen={leaveLeagueModal.isOpen} 
            onClose={leaveLeagueModal.onClose} 
            onSubmit={onLeave} 
            body={bodyContent} 
            actionLabel="Confirm" 
            secondaryActionLabel="Cancel" 
            secondaryAction={leaveLeagueModal.onClose} 
            disabled={isLoading} 
        />
    );
}

export default LeaveLeagueModal;
