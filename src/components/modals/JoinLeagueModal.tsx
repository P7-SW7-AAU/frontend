"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useJoinLeagueModal } from "@/hooks/useJoinLeagueModal";
import { useResetOnRouteChange } from "@/hooks/useResetOnRouteChange";

import Modal from "./Modal";
import { Input } from "../ui/input";

const JoinLeagueModal = () => {
    const router = useRouter();
    const joinLeagueModal = useJoinLeagueModal();
    
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
        // TODO: Endpoint call
        // TODO: Handle errors (e.g., league not found, already in league, league full)
    }

    useEffect(() => {
        if (joinLeagueModal.isOpen) {
            setTimeout(() => setFocus("name"), 50);
        }
    }, [joinLeagueModal.isOpen, setFocus]);

    useResetOnRouteChange(reset);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Join Existing League
            </span>
            <Input 
                placeholder="Enter a valid code" 
                className="text-white font-medium border-[#1E2938]" 
                maxLength={10}
                {...register("name", { 
                    required: "A valid code is required",
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
            isOpen={joinLeagueModal.isOpen} 
            onClose={joinLeagueModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            actionLabel="Join" 
            disabled={isLoading} 
        />
    );
}

export default JoinLeagueModal;
