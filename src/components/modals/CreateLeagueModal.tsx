"use client";

import type { ClipboardEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { useCreateLeagueModal } from "@/hooks/useCreateLeagueModal";
import { useResetOnRouteChange } from "@/hooks/useResetOnRouteChange";

import { createLeague } from "@/services/leaguesService";

import Modal from "./Modal";
import { Input } from "../ui/input";

const CreateLeagueModal = () => {
    const router = useRouter();
    const createLeagueModal = useCreateLeagueModal();
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
            maxTeams: undefined,
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        createLeague(data, api)
            .then(() => {
                toast.success("League created successfully!");
                createLeagueModal.onClose();
                router.refresh();
            })
            .catch((error) => {
                toast.error("Failed to create league: " + error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (createLeagueModal.isOpen) {
            setTimeout(() => setFocus("name"), 50);
        }
    }, [createLeagueModal.isOpen, setFocus]);

    useResetOnRouteChange(reset);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Create New League
            </span>
            <Input
                placeholder="Enter a league name"
                className="text-white font-medium border-[#1E2938]"
                maxLength={25}
                {...register("name", { 
                    required: "League name is required",
                    pattern: {
                        value: /^[A-Za-z0-9 ]+$/,
                        message: "Only letters, numbers, and spaces are allowed"
                    }
                })}
            />
            {errors.name && (
                <p className="text-sm text-red-400">{String(errors.name.message)}</p>
            )}

            <Input
                type="number"
                inputMode="numeric"
                pattern="\d*"
                placeholder="Set maximum team size"
                className="text-white font-medium border-[#1E2938]"
                {...register("maxTeams", {
                    required: "Maximum team size is required",
                    valueAsNumber: true,
                    min: { value: 2, message: "Minimum team size is 2" },
                    max: { value: 100, message: "Maximum team size is 100" },
                })}
                onKeyDown={(e) => {
                    // Prevent certain non-digit characters that number inputs may allow (e, +, -)
                    const invalidKeys = new Set(['e', 'E', '+', '-']);
                    if (invalidKeys.has(e.key)) {
                        e.preventDefault();
                    }
                }}
                onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
                    // Prevent pasting non-numeric values
                    const paste = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(paste)) {
                        e.preventDefault();
                    }
                }}
            />
            {errors.maxTeamSize && (
                <p className="text-sm text-red-400">{String(errors.maxTeamSize.message)}</p>
            )}
        </div>
    );

    return (
        <Modal 
            isOpen={createLeagueModal.isOpen} 
            onClose={createLeagueModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            actionLabel="Create" 
            disabled={isLoading} 
        />
    );
}

export default CreateLeagueModal;
