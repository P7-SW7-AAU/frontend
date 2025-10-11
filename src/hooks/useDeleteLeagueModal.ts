import { create } from "zustand";

interface DeleteLeagueModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useDeleteLeagueModal = create<DeleteLeagueModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
