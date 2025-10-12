import { create } from "zustand";

interface SelectTeamModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useSelectTeamModal = create<SelectTeamModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
