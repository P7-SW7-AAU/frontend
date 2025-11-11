"use client";

import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useDeleteLeagueModal } from "@/hooks/useDeleteLeagueModal";
import { useApi } from "@/hooks/useApi";

import Modal from "./Modal";

import { deleteLeague } from "@/services/leaguesService";

interface DeleteLeagueModalProps {
    leagueId: string | null;
}

const DeleteLeagueModal = ({ leagueId }: DeleteLeagueModalProps) => {
    const router = useRouter();
    const deleteLeagueModal = useDeleteLeagueModal();
    const { api } = useApi();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        if (!leagueId) {
            toast.error("No league selected for deletion.");
            return;
        }

        setIsLoading(true);

        deleteLeague(leagueId, api)
            .then(() => {
                toast.success("League deleted successfully!");
                deleteLeagueModal.onClose();
                router.refresh();
            })
            .catch((error) => {
                toast.error("Failed to delete league: " + error.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [leagueId, api, router, deleteLeagueModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Delete League
            </span>
            <p className="flex items-center justify-center text-primary-gray text-medium font-medium">
                This will delete the league for all users!
            </p>
        </div>
    );

    return (
        <Modal 
            isOpen={deleteLeagueModal.isOpen} 
            onClose={deleteLeagueModal.onClose} 
            onSubmit={onDelete} 
            body={bodyContent} 
            actionLabel="Confirm" 
            secondaryActionLabel="Cancel" 
            secondaryAction={deleteLeagueModal.onClose} 
            disabled={isLoading} 
        />
    );
}

export default DeleteLeagueModal;
