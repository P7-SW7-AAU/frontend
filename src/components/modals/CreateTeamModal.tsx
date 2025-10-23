"use client";

import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useCreateTeamModal } from "@/hooks/useCreateTeamModal";
import { useResetOnRouteChange } from "@/hooks/useResetOnRouteChange";

import Modal from "./Modal";
import { Input } from "../ui/input";

const CreateTeamModal = () => {
    const router = useRouter();
    const createTeamModal = useCreateTeamModal();

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
            onSubmit={handleSubmit((data) => router.push(`/teams/${encodeURIComponent(data.name)}`))}
            body={bodyContent} 
            actionLabel="Add Players" 
        />
    );
}

export default CreateTeamModal;
