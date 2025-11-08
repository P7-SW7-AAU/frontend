"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { useEditTeamModal } from "@/hooks/useEditTeamModal";
import { useResetOnRouteChange } from "@/hooks/useResetOnRouteChange";

import { updateTeam } from "@/services/teamsService";

import Modal from "./Modal";
import { Input } from "../ui/input";

interface EditTeamModalProps {
    teamId: string | null;
    teamName?: string;
}

const EditTeamModal = ({ teamId, teamName }: EditTeamModalProps) => {
    const { api } = useApi();
    const router = useRouter();
    const editTeamModal = useEditTeamModal();
    
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
        if (!teamId) {
            toast.error("No team ID provided for editing.");
            return;
        }

        setIsLoading(true);

        updateTeam(teamId, data, api)
            .then(() => {
                toast.success("Team updated successfully!");
                editTeamModal.onClose();
                router.refresh();
            })
            .catch((error) => {
                toast.error("Failed to update team: " + error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (editTeamModal.isOpen) {
            reset({ name: teamName });
            setTimeout(() => setFocus("name"), 50);
        }
    }, [editTeamModal.isOpen, setFocus, teamName, reset]);

    useResetOnRouteChange(reset);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Edit Team
            </span>
            <Input 
                placeholder="Change your team name" 
                className="text-white font-medium border-[#1E2938]" 
                maxLength={25}
                inputMode="text"
                pattern="[A-Za-z0-9]+"
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
