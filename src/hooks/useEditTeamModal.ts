import { create } from "zustand";

interface EditTeamModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useEditTeamModal = create<EditTeamModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
