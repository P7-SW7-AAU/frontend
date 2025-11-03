"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useDeleteTeamModal } from "@/hooks/useDeleteTeamModal";

import { deleteTeam } from "@/services/teamsService";

import Modal from "./Modal";

import { useApi } from "@/hooks/useApi";

const DeleteTeamModal = ({ teamId }: { teamId: string | null }) => {
    const { api } = useApi();
    const router = useRouter();
    const deleteTeamModal = useDeleteTeamModal();
    
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        if (!teamId) {
            toast.error("No team selected for deletion.");
            return;
        }

        setIsLoading(true);

        deleteTeam(teamId, api)
            .then(() => {
                toast.success("Team deleted successfully!");
                deleteTeamModal.onClose();
                router.refresh();
            })
            .catch((error) => {
                toast.error("Failed to delete team: " + error.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [teamId]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Delete Team
            </span>
            <p className="flex items-center justify-center text-primary-gray text-medium font-medium">
                This action cannot be undone!
            </p>
        </div>
    );

    return (
        <Modal 
            isOpen={deleteTeamModal.isOpen} 
            onClose={deleteTeamModal.onClose} 
            onSubmit={onDelete} 
            body={bodyContent} 
            actionLabel="Confirm" 
            secondaryActionLabel="Cancel" 
            secondaryAction={deleteTeamModal.onClose} 
            disabled={isLoading} 
        />
    );
}

export default DeleteTeamModal;
