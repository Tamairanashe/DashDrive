export interface Merchant {
    id: string;
    email: string;
    storeName: string;
    phone?: string;
    isVerified: boolean;
    pushToken?: string;
    countryId: string;
}

export interface Store {
    id: string;
    merchantId: string;
    name: string;
    address: string;
    city: string;
    currency: string;
    timezone: string;
    isActive: boolean;
}

export interface AuthResponse {
    merchant: Merchant;
    store?: Store;
    access_token: string;
}
