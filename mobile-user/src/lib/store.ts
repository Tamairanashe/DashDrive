import { useEffect, useState } from 'react';

interface SavedPlace {
    id: string;
    title: string;
    address: string;
    icon: string;
}

interface SavedPlacesState {
    home: SavedPlace | null;
    work: SavedPlace | null;
    custom: SavedPlace[];
    isBusinessMode: boolean;
    hasCompanyProfile: boolean;
    userMode: 'rider' | 'pilot';
    isPilotRegistered: boolean;
    isDriverMode: boolean;
}

let state: SavedPlacesState = {
    home: null,
    work: null,
    custom: [],
    isBusinessMode: false,
    hasCompanyProfile: false,
    userMode: 'rider',
    isPilotRegistered: false,
    isDriverMode: false,
};

const listeners = new Set<() => void>();

const setState = (newState: Partial<SavedPlacesState>) => {
    state = { ...state, ...newState };
    listeners.forEach((l) => l());
};

export const useSavedPlacesStore = () => {
    const [currState, setCurrState] = useState(state);

    useEffect(() => {
        let isMounted = true;
        const listener = () => {
            if (isMounted) setCurrState(state);
        };
        listeners.add(listener);
        return () => {
            isMounted = false;
            listeners.delete(listener);
        };
    }, []);

    return {
        ...currState,
        setHome: (address: string, title?: string) => setState({ home: { id: 'home', title: title || 'Home', address, icon: 'home-outline' } }),
        setWork: (address: string, title?: string) => setState({ work: { id: 'work', title: title || 'Work', address, icon: 'briefcase-outline' } }),
        addCustom: (title: string, address: string) => setState({
            custom: [...state.custom, { id: Math.random().toString(), title, address, icon: 'location-outline' }]
        }),
        updateCustom: (id: string, title: string, address: string) => setState({
            custom: state.custom.map(p => p.id === id ? { ...p, title, address } : p)
        }),
        removeHome: () => setState({ home: null }),
        removeWork: () => setState({ work: null }),
        removeCustom: (id: string) => setState({
            custom: state.custom.filter(p => p.id !== id)
        }),
        setIsBusinessMode: (value: boolean) => setState({ isBusinessMode: value }),
        setHasCompanyProfile: (value: boolean) => setState({ hasCompanyProfile: value }),
        setUserMode: (mode: 'rider' | 'pilot') => setState({ userMode: mode, isDriverMode: mode === 'pilot' }),
        setIsPilotRegistered: (value: boolean) => setState({ isPilotRegistered: value }),
        setIsDriverMode: (value: boolean) => setState({ isDriverMode: value, userMode: value ? 'pilot' : 'rider' }),
    };
};
