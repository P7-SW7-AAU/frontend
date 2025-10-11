import { create } from "zustand";

interface JoinLeagueModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useJoinLeagueModal = create<JoinLeagueModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
