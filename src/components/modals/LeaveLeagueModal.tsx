"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useLeaveLeagueModal } from "@/hooks/useLeaveLeagueModal";

import Modal from "./Modal";

const LeaveLeagueModal = () => {
    const router = useRouter();
    const leaveLeagueModal = useLeaveLeagueModal();
    
    const [isLoading, setIsLoading] = useState(false);

    const onLeave = useCallback(() => {
        setIsLoading(true);
        // TODO: Endpoint call
        console.log("Leave league");
    }, []);

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
