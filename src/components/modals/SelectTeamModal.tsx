"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useSelectTeamModal } from "@/hooks/useSelectTeam";
import { useResetOnRouteChange } from "@/hooks/useResetOnRouteChange";

import Modal from "./Modal";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { getUserTeams } from "@/data/multiSportMockData";

const SelectTeamModal = () => {
    const router = useRouter();
    const userTeams = getUserTeams();
    const selectTeamModal = useSelectTeamModal();

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setFocus,
        reset,
        control,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            team: "",
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        // TODO: Endpoint call
    }

    useEffect(() => {
        if (selectTeamModal.isOpen) {
            setTimeout(() => setFocus("name"), 50);
        }
    }, [selectTeamModal.isOpen, setFocus]);

    useResetOnRouteChange(reset);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-center text-white text-2xl font-semibold">
                Select Team
            </span>
            <Controller
                name="team"
                control={control}
                rules={{ required: "Please select a team" }}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                        <SelectContent>
                            {userTeams.map(team => (
                                <SelectItem key={team.uniqueID} value={team.uniqueID}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white group-hover:text-black group-focus:text-black font-semibold">
                                            {team.name}
                                        </span>
                                        {/* <Badge variant="secondary" className="text-xs">
                                            {team.playerCount} players
                                        </Badge> */}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.team && (
                <p className="text-sm text-red-400">{String(errors.team.message)}</p>
            )}
        </div>
    );

    return (
        <Modal 
            isOpen={selectTeamModal.isOpen} 
            onClose={selectTeamModal.onClose} 
            onSubmit={handleSubmit(onSubmit)} 
            body={bodyContent} 
            actionLabel="Save" 
            disabled={isLoading} 
        />
    );
}

export default SelectTeamModal;
