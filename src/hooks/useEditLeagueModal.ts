import { create } from "zustand";

interface EditLeagueModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useEditLeagueModal = create<EditLeagueModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
