import { create } from 'zustand';

interface StoreState {
    activeStoreId: string | null;
    setActiveStoreId: (id: string | null) => void;
}

export const useStoreContext = create<StoreState>((set) => ({
    activeStoreId: null, // null means "All Stores" or needs selection
    setActiveStoreId: (id) => set({ activeStoreId: id }),
}));
