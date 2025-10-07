// It's possible to combine the CreateTeamModal and EditTeamModal into one component later on

"use client";

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useEditTeamModal } from "@/hooks/useEditTeamModal";

import Modal from "./Modal";
import { Input } from "../ui/input";

const EditTeamModal = () => {
    const router = useRouter();
    const editTeamModal = useEditTeamModal();
    
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
                Edit Team
            </span>
            <Input placeholder="Change your team name" className="text-white font-medium border-[#1E2938]" />
        </div>
    );

    return (
        <Modal 
            isOpen={editTeamModal.isOpen} 
            onClose={editTeamModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            actionLabel="Save" 
            disabled={isLoading} 
        />
    );
}

export default EditTeamModal;
