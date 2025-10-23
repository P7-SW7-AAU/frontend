"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useCreateTeamModal } from "@/hooks/useCreateTeamModal";
import { useResetOnRouteChange } from "@/hooks/useResetOnRouteChange";
import { useApi } from "@/hooks/useApi";

import { createTeam } from "@/services/teamsService";

import Modal from "./Modal";
import { Input } from "../ui/input";

const CreateTeamModal = () => {
    const router = useRouter();
    const createTeamModal = useCreateTeamModal();
    const { api } = useApi();
    
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setFocus,
        reset,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        createTeam(data, api)
            .then(() => {
                toast.success("Team created successfully!");
                router.refresh();
                reset();
                createTeamModal.onClose();
            })
            .catch((error) => {
                toast.error("Error creating team: " + error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (createTeamModal.isOpen) {
            setTimeout(() => setFocus("name"), 50);
        }
    }, [createTeamModal.isOpen, setFocus]);

    useResetOnRouteChange(reset);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Create New Team
            </span>
            <Input 
                placeholder="Enter a team name" 
                className="text-white font-medium border-[#1E2938]" 
                maxLength={25}
                {...register("name", { 
                    required: "Team name is required",
                    pattern: {
                        value: /^[A-Za-z0-9 ]+$/,
                        message: "Only letters, numbers, and spaces are allowed"
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
            isOpen={createTeamModal.isOpen} 
            onClose={createTeamModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            actionLabel="Create" 
            disabled={isLoading} 
        />
    );
}

export default CreateTeamModal;
