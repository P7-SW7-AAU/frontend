import { create } from "zustand";

interface CreateLeagueModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreateLeagueModal = create<CreateLeagueModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
