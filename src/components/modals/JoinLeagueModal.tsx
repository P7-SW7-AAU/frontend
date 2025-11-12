"use client";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { useJoinLeagueModal } from "@/hooks/useJoinLeagueModal";
import { useResetOnRouteChange } from "@/hooks/useResetOnRouteChange";

import Modal from "./Modal";
import { Input } from "../ui/input";

import { joinLeague } from "@/services/leaguesService";
import { toast } from "sonner";

const JoinLeagueModal = () => {
    const { api } = useApi();
    const router = useRouter();
    const joinLeagueModal = useJoinLeagueModal();
    
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setFocus,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            code: "",
        }
    });
    // Handler to force uppercase input
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const upper = e.target.value.toUpperCase();
        setValue("code", upper, { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        joinLeague(data, api)
            .then(() => {
                toast.success("League joined successfully!");
                reset();
                joinLeagueModal.onClose();
                router.refresh();
            })
            .catch((error) => {
                const status = error?.response?.status || error?.status;
                if (status === 409) {
                    toast.error("You are already a member of that league.");
                } else if (status === 403) {
                    toast.error("This league is full");
                } else {
                    toast.error("Failed to join league: Invalid code.");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (joinLeagueModal.isOpen) {
            setTimeout(() => setFocus("code"), 50);
        }
    }, [joinLeagueModal.isOpen, setFocus]);

    useResetOnRouteChange(reset);

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                <span className="flex items-center justify-center text-white text-2xl font-semibold">
                    Join Existing League
                </span>
                <Input 
                    placeholder="Enter a valid code" 
                    className="text-white font-medium border-[#1E2938] uppercase-input"
                    maxLength={6}
                    {...register("code", { 
                        required: "A valid code is required",
                        pattern: {
                            value: /^[A-Za-z0-9]+$/,
                            message: "Only letters and numbers are allowed"
                        }
                    })}
                    onChange={handleCodeChange}
                />
                {errors.code && (
                    <p className="text-sm text-red-400">{String(errors.code.message)}</p>
                )}
            </div>
            {/* Add style to only uppercase input value, not placeholder */}
            <style jsx global>{`
            .uppercase-input {
              text-transform: uppercase;
            }
            .uppercase-input::placeholder {
              text-transform: none;
            }
            `}</style>
        </>
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
