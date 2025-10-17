import { create } from "zustand";

interface LeaveLeagueModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useLeaveLeagueModal = create<LeaveLeagueModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
