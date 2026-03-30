import { useEffect, useState } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    priceString: string;
    quantity: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    promoCode: string | null;
    discountAmount: number;
    subtotal: number;
}

let state: CartState = {
    items: [],
    promoCode: null,
    discountAmount: 0,
    subtotal: 0,
};

const listeners = new Set<() => void>();

const setState = (newState: Partial<CartState>) => {
    state = { ...state, ...newState };
    listeners.forEach((l) => l());
};

const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const useCartStore = () => {
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
        addItem: (item: CartItem) => {
            const existing = state.items.find(i => i.id === item.id);
            let nextItems;
            if (existing) {
                nextItems = state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            } else {
                nextItems = [...state.items, { ...item, quantity: 1 }];
            }
            setState({ items: nextItems, subtotal: calculateSubtotal(nextItems) });
        },
        removeItem: (id: string) => {
            const nextItems = state.items.filter(i => i.id !== id);
            setState({ items: nextItems, subtotal: calculateSubtotal(nextItems) });
        },
        updateQuantity: (id: string, delta: number) => {
            const nextItems = state.items.map(i => {
                if (i.id === id) {
                    const nextQty = Math.max(1, i.quantity + delta);
                    return { ...i, quantity: nextQty };
                }
                return i;
            });
            setState({ items: nextItems, subtotal: calculateSubtotal(nextItems) });
        },
        setPromoCode: (code: string | null, discount: number = 0) => {
            setState({ promoCode: code, discountAmount: discount });
        },
        clearCart: () => setState({ items: [], promoCode: null, discountAmount: 0, subtotal: 0 }),
    };
};
