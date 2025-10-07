"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useDeleteTeamModal } from "@/hooks/useDeleteTeamModal";

import Modal from "./Modal";

const DeleteTeamModal = () => {
    const router = useRouter();
    const deleteTeamModal = useDeleteTeamModal();
    
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        setIsLoading(true);
        // TODO: Endpoint call
        console.log("Delete team");
    }, []);

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
