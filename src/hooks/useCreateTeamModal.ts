import { create } from "zustand";

interface CreateTeamModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreateTeamModal = create<CreateTeamModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
