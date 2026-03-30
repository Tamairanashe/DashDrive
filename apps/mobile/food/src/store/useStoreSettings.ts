import { create } from "zustand";

interface StoreSettings {
    acceptanceMode: 'manual' | 'auto';
    setAcceptanceMode: (mode: 'manual' | 'auto') => void;
}

export const useStoreSettings = create<StoreSettings>((set) => ({
    acceptanceMode: 'manual', // default
    setAcceptanceMode: (mode) => set({ acceptanceMode: mode }),
}));
