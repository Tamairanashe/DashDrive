import { create } from 'zustand';

type Module = string;

interface NavigationState {
  activeModule: Module;
  params: Record<string, string>;
  setActiveModule: (module: Module, params?: Record<string, string>) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeModule: 'Dashboard',
  params: {},
  setActiveModule: (module, params = {}) => set({ activeModule: module, params }),
}));
