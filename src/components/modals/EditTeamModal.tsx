"use client";

import { useCallback, useEffect, useState } from "react";
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
        setFocus,
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

    useEffect(() => {
        if (editTeamModal.isOpen) {
            setTimeout(() => setFocus("name"), 50);
        }
    }, [editTeamModal.isOpen, setFocus]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Edit Team
            </span>
            <Input 
                // TODO: Display current team name
                placeholder="Change your team name" 
                className="text-white font-medium border-[#1E2938]" 
                maxLength={25}
                inputMode="text"
                pattern="[A-Za-z0-9]+"
                {...register("name", { 
                    required: "Team name is required",
                    pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message: "Only letters and numbers are allowed"
                    }
                })}
            />
            {errors.name && (
                <p className="text-sm text-red-400">{String(errors.name.message)}</p>
            )}
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
