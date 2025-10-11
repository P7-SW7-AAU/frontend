"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClipboardEvent } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useEditLeagueModal } from "@/hooks/useEditLeagueModal";

import Modal from "./Modal";
import { Input } from "../ui/input";

const EditLeagueModal = () => {
    const router = useRouter();
    const editLeagueModal = useEditLeagueModal();

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
        if (editLeagueModal.isOpen) {
            setTimeout(() => setFocus("name"), 50);
        }
    }, [editLeagueModal.isOpen, setFocus]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Edit League
            </span>
            <Input
                placeholder="Change your league name"
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
                // TODO: Make sure you can't set team size to a smaller number than current team size
                // TODO: Display current team name and size
                type="number"
                inputMode="numeric"
                pattern="\d*"
                placeholder="Set maximum team size"
                className="text-white font-medium border-[#1E2938]"
                {...register("maxTeamSize", {
                    required: "Maximum team size is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Minimum team size is 1" },
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
            isOpen={editLeagueModal.isOpen} 
            onClose={editLeagueModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            actionLabel="Save" 
            disabled={isLoading} 
        />
    );
}

export default EditLeagueModal;
