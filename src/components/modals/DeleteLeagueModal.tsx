"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useDeleteLeagueModal } from "@/hooks/useDeleteLeagueModal";

import Modal from "./Modal";

const DeleteLeagueModal = () => {
    const router = useRouter();
    const deleteLeagueModal = useDeleteLeagueModal();
    
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        setIsLoading(true);
        // TODO: Endpoint call
        console.log("Delete league");
    }, []);

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
