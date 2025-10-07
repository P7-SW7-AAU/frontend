"use client";

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useCreateTeamModal } from "@/hooks/useCreateTeamModal";

import Modal from "./Modal";
import { Input } from "../ui/input";

const CreateTeamModal = () => {
    const router = useRouter();
    const createTeamModal = useCreateTeamModal();
    
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        // TODO: Endpoint call
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Create New Team
            </span>
            <Input placeholder="Enter a team name" className="text-white font-medium border-[#1E2938]" />
        </div>
    );

    return (
        <Modal 
            isOpen={createTeamModal.isOpen} 
            onClose={createTeamModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            actionLabel="Save" 
            disabled={isLoading} 
        />
    );
}

export default CreateTeamModal;
