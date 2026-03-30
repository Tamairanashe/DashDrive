import { create } from "zustand";

interface SLASettings {
    warningMinutes: number;
    breachMinutes: number;
    setSLA: (warning: number, breach: number) => void;
}

export const useSLASettings = create<SLASettings>((set) => ({
    warningMinutes: 10,
    breachMinutes: 20,
    setSLA: (warning, breach) => set({ warningMinutes: warning, breachMinutes: breach }),
}));
