import { create } from "zustand";

interface DeleteTeamModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useDeleteTeamModal = create<DeleteTeamModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
