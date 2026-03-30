import { useEffect, useState } from 'react';

// ============== Types ==============

export type DriverStatus = 'active' | 'pending' | 'suspended';
export type PassengerStatus = 'active' | 'suspended';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Vehicle {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    type: 'sedan' | 'suv' | 'van' | 'luxury';
    seats: number;
}

export interface DriverDocument {
    id: string;
    type: 'license' | 'national_id' | 'insurance' | 'vehicle_registration';
    status: DocumentStatus;
    uploadedAt: string;
    expiryDate?: string;
}

export interface Driver {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    status: DriverStatus;
    rating: number;
    totalTrips: number;
    joinedAt: string;
    vehicle: Vehicle;
    documents: DriverDocument[];
    earnings: {
        today: number;
        week: number;
        month: number;
        total: number;
    };
}

export interface Passenger {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    status: PassengerStatus;
    rating: number;
    totalTrips: number;
    joinedAt: string;
    totalSpent: number;
}

export interface Transaction {
    id: string;
    type: 'trip' | 'refund' | 'payout' | 'commission';
    amount: number;
    date: string;
    description: string;
    driverId?: string;
    passengerId?: string;
}

export interface SafetyIncident {
    id: string;
    type: 'sos' | 'report' | 'complaint';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'investigating' | 'resolved';
    description: string;
    reportedAt: string;
    reportedBy: string;
    tripId?: string;
}

export interface PromoCode {
    id: string;
    code: string;
    discountPercent: number;
    maxUses: number;
    currentUses: number;
    expiryDate: string;
    isActive: boolean;
}

export interface RequiredDocument {
    id: string;
    name: string;
    description: string;
    isRequired: boolean;
    category: 'identity' | 'vehicle' | 'license' | 'other';
}

// ============== Mock Data ==============

const MOCK_REQUIRED_DOCUMENTS: RequiredDocument[] = [
    { id: 'rd1', name: 'Driving License', description: 'Valid front and back copy of national driving license', isRequired: true, category: 'license' },
    { id: 'rd2', name: 'Vehicle Insurance', description: 'Current insurance certificate for the registered vehicle', isRequired: true, category: 'vehicle' },
    { id: 'rd3', name: 'National ID Proof', description: 'Government issued ID card or Passport', isRequired: true, category: 'identity' },
    { id: 'rd4', name: 'Vehicle Registration', description: 'V5C or equivalent vehicle registration document', isRequired: true, category: 'vehicle' },
    { id: 'rd5', name: 'Background Check', description: 'Enhanced criminal record check certificate', isRequired: false, category: 'other' },
];

const MOCK_DRIVERS: Driver[] = [
    {
        id: 'd1',
        name: 'James Wilson',
        email: 'james.wilson@email.com',
        phone: '+44 7700 900123',
        status: 'active',
        rating: 4.92,
        totalTrips: 1247,
        joinedAt: '2024-03-15',
        vehicle: {
            make: 'Toyota',
            model: 'Camry',
            year: 2022,
            color: 'Black',
            plateNumber: 'AB12 CDE',
            type: 'sedan',
            seats: 4,
        },
        documents: [
            { id: 'doc1', type: 'license', status: 'approved', uploadedAt: '2024-03-15', expiryDate: '2027-03-15' },
            { id: 'doc2', type: 'national_id', status: 'approved', uploadedAt: '2024-03-15' },
            { id: 'doc3', type: 'insurance', status: 'approved', uploadedAt: '2024-03-15', expiryDate: '2025-03-15' },
        ],
        earnings: { today: 127.50, week: 842.30, month: 3246.80, total: 45892.00 },
    },
    {
        id: 'd2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+44 7700 900456',
        status: 'active',
        rating: 4.88,
        totalTrips: 892,
        joinedAt: '2024-05-22',
        vehicle: {
            make: 'Honda',
            model: 'Accord',
            year: 2023,
            color: 'Silver',
            plateNumber: 'XY34 FGH',
            type: 'sedan',
            seats: 4,
        },
        documents: [
            { id: 'doc4', type: 'license', status: 'approved', uploadedAt: '2024-05-22', expiryDate: '2028-05-22' },
            { id: 'doc5', type: 'national_id', status: 'approved', uploadedAt: '2024-05-22' },
            { id: 'doc6', type: 'insurance', status: 'approved', uploadedAt: '2024-05-22', expiryDate: '2025-05-22' },
        ],
        earnings: { today: 98.00, week: 612.50, month: 2854.20, total: 32150.00 },
    },
    {
        id: 'd3',
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        phone: '+44 7700 900789',
        status: 'pending',
        rating: 0,
        totalTrips: 0,
        joinedAt: '2025-02-01',
        vehicle: {
            make: 'BMW',
            model: '3 Series',
            year: 2024,
            color: 'White',
            plateNumber: 'LM56 NOP',
            type: 'luxury',
            seats: 4,
        },
        documents: [
            { id: 'doc7', type: 'license', status: 'pending', uploadedAt: '2025-02-01', expiryDate: '2029-02-01' },
            { id: 'doc8', type: 'national_id', status: 'pending', uploadedAt: '2025-02-01' },
            { id: 'doc9', type: 'insurance', status: 'pending', uploadedAt: '2025-02-01', expiryDate: '2026-02-01' },
        ],
        earnings: { today: 0, week: 0, month: 0, total: 0 },
    },
    {
        id: 'd4',
        name: 'Emma Davis',
        email: 'emma.d@email.com',
        phone: '+44 7700 900321',
        status: 'suspended',
        rating: 3.45,
        totalTrips: 156,
        joinedAt: '2024-08-10',
        vehicle: {
            make: 'Ford',
            model: 'Focus',
            year: 2021,
            color: 'Blue',
            plateNumber: 'QR78 STU',
            type: 'sedan',
            seats: 4,
        },
        documents: [
            { id: 'doc10', type: 'license', status: 'approved', uploadedAt: '2024-08-10', expiryDate: '2026-08-10' },
            { id: 'doc11', type: 'national_id', status: 'approved', uploadedAt: '2024-08-10' },
            { id: 'doc12', type: 'insurance', status: 'rejected', uploadedAt: '2024-08-10', expiryDate: '2024-08-10' },
        ],
        earnings: { today: 0, week: 0, month: 0, total: 4520.00 },
    },
    {
        id: 'd5',
        name: 'David Chen',
        email: 'david.chen@email.com',
        phone: '+44 7700 900654',
        status: 'pending',
        rating: 0,
        totalTrips: 0,
        joinedAt: '2025-02-05',
        vehicle: {
            make: 'Mercedes',
            model: 'E-Class',
            year: 2023,
            color: 'Black',
            plateNumber: 'VW90 XYZ',
            type: 'luxury',
            seats: 4,
        },
        documents: [
            { id: 'doc13', type: 'license', status: 'approved', uploadedAt: '2025-02-05', expiryDate: '2030-02-05' },
            { id: 'doc14', type: 'national_id', status: 'pending', uploadedAt: '2025-02-05' },
            { id: 'doc15', type: 'insurance', status: 'pending', uploadedAt: '2025-02-05', expiryDate: '2026-02-05' },
        ],
        earnings: { today: 0, week: 0, month: 0, total: 0 },
    },
];

const MOCK_PASSENGERS: Passenger[] = [
    { id: 'p1', name: 'Alice Thompson', email: 'alice.t@email.com', phone: '+44 7800 100123', status: 'active', rating: 4.95, totalTrips: 234, joinedAt: '2024-01-10', totalSpent: 3456.80 },
    { id: 'p2', name: 'Robert Garcia', email: 'robert.g@email.com', phone: '+44 7800 100456', status: 'active', rating: 4.78, totalTrips: 89, joinedAt: '2024-06-15', totalSpent: 1234.50 },
    { id: 'p3', name: 'Jennifer Lee', email: 'jennifer.l@email.com', phone: '+44 7800 100789', status: 'active', rating: 4.88, totalTrips: 156, joinedAt: '2024-04-20', totalSpent: 2150.00 },
    { id: 'p4', name: 'William Martinez', email: 'william.m@email.com', phone: '+44 7800 100321', status: 'suspended', rating: 2.10, totalTrips: 23, joinedAt: '2024-11-01', totalSpent: 280.00 },
    { id: 'p5', name: 'Emily Anderson', email: 'emily.a@email.com', phone: '+44 7800 100654', status: 'active', rating: 5.00, totalTrips: 412, joinedAt: '2023-09-05', totalSpent: 6780.25 },
    { id: 'p6', name: 'Christopher Taylor', email: 'chris.t@email.com', phone: '+44 7800 100987', status: 'active', rating: 4.65, totalTrips: 67, joinedAt: '2024-08-22', totalSpent: 890.00 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', type: 'trip', amount: 28.50, date: '2025-02-09', description: 'Trip #4521 - Stratford to Heathrow', driverId: 'd1', passengerId: 'p1' },
    { id: 't2', type: 'commission', amount: 5.70, date: '2025-02-09', description: 'Commission from Trip #4521', driverId: 'd1' },
    { id: 't3', type: 'payout', amount: -842.30, date: '2025-02-08', description: 'Weekly payout to James Wilson', driverId: 'd1' },
    { id: 't4', type: 'trip', amount: 15.00, date: '2025-02-09', description: 'Trip #4522 - Camden to Kings Cross', driverId: 'd2', passengerId: 'p3' },
    { id: 't5', type: 'refund', amount: -8.50, date: '2025-02-08', description: 'Refund for cancelled trip #4518', passengerId: 'p2' },
];

const MOCK_SAFETY_INCIDENTS: SafetyIncident[] = [
    { id: 's1', type: 'sos', priority: 'critical', status: 'resolved', description: 'SOS triggered during trip - false alarm confirmed', reportedAt: '2025-02-08 14:32', reportedBy: 'Alice Thompson', tripId: 'trip123' },
    { id: 's2', type: 'complaint', priority: 'medium', status: 'investigating', description: 'Passenger reports unsafe driving behavior', reportedAt: '2025-02-07 18:45', reportedBy: 'Robert Garcia', tripId: 'trip456' },
    { id: 's3', type: 'report', priority: 'low', status: 'open', description: 'Driver reported incorrect route taken', reportedAt: '2025-02-06 09:15', reportedBy: 'Jennifer Lee', tripId: 'trip789' },
];

const MOCK_PROMO_CODES: PromoCode[] = [
    { id: 'promo1', code: 'WELCOME50', discountPercent: 50, maxUses: 1000, currentUses: 456, expiryDate: '2025-03-31', isActive: true },
    { id: 'promo2', code: 'SPRING25', discountPercent: 25, maxUses: 500, currentUses: 123, expiryDate: '2025-04-15', isActive: true },
    { id: 'promo3', code: 'VIP10', discountPercent: 10, maxUses: -1, currentUses: 2341, expiryDate: '2025-12-31', isActive: true },
    { id: 'promo4', code: 'EXPIRED20', discountPercent: 20, maxUses: 200, currentUses: 200, expiryDate: '2025-01-31', isActive: false },
];

// ============== State Management ==============

interface AdminState {
    drivers: Driver[];
    passengers: Passenger[];
    transactions: Transaction[];
    safetyIncidents: SafetyIncident[];
    promoCodes: PromoCode[];
    requiredDocuments: RequiredDocument[];
}

let state: AdminState = {
    drivers: MOCK_DRIVERS,
    passengers: MOCK_PASSENGERS,
    transactions: MOCK_TRANSACTIONS,
    safetyIncidents: MOCK_SAFETY_INCIDENTS,
    promoCodes: MOCK_PROMO_CODES,
    requiredDocuments: MOCK_REQUIRED_DOCUMENTS,
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
    listeners.forEach((l) => l());
};

const setState = (newState: Partial<AdminState>) => {
    state = { ...state, ...newState };
    notifyListeners();
};

// ============== Hook ==============

export const useAdminStore = () => {
    const [currState, setCurrState] = useState(state);

    useEffect(() => {
        let isMounted = true;
        const listener = () => {
            if (isMounted) setCurrState({ ...state });
        };
        listeners.add(listener);
        return () => {
            isMounted = false;
            listeners.delete(listener);
        };
    }, []);

    // Statistics
    const getStats = () => {
        const drivers = currState.drivers;
        const passengers = currState.passengers;
        const transactions = currState.transactions;

        return {
            totalDrivers: drivers.length,
            activeDrivers: drivers.filter((d) => d.status === 'active').length,
            pendingDrivers: drivers.filter((d) => d.status === 'pending').length,
            suspendedDrivers: drivers.filter((d) => d.status === 'suspended').length,
            totalPassengers: passengers.length,
            activePassengers: passengers.filter((p) => p.status === 'active').length,
            totalTripsToday: transactions.filter((t) => t.type === 'trip' && t.date === '2025-02-09').length,
            totalRevenue: transactions.filter((t) => t.type === 'commission').reduce((acc, t) => acc + t.amount, 0),
            totalPayouts: Math.abs(transactions.filter((t) => t.type === 'payout').reduce((acc, t) => acc + t.amount, 0)),
            openIncidents: currState.safetyIncidents.filter((s) => s.status !== 'resolved').length,
        };
    };

    // Driver actions
    const approveDriver = (driverId: string) => {
        const drivers = currState.drivers.map((d) =>
            d.id === driverId ? { ...d, status: 'active' as DriverStatus } : d
        );
        setState({ drivers });
    };

    const suspendDriver = (driverId: string) => {
        const drivers = currState.drivers.map((d) =>
            d.id === driverId ? { ...d, status: 'suspended' as DriverStatus } : d
        );
        setState({ drivers });
    };

    const activateDriver = (driverId: string) => {
        const drivers = currState.drivers.map((d) =>
            d.id === driverId ? { ...d, status: 'active' as DriverStatus } : d
        );
        setState({ drivers });
    };

    const approveDocument = (driverId: string, docId: string) => {
        const drivers = currState.drivers.map((d) =>
            d.id === driverId
                ? {
                    ...d,
                    documents: d.documents.map((doc) =>
                        doc.id === docId ? { ...doc, status: 'approved' as DocumentStatus } : doc
                    ),
                }
                : d
        );
        setState({ drivers });
    };

    const rejectDocument = (driverId: string, docId: string) => {
        const drivers = currState.drivers.map((d) =>
            d.id === driverId
                ? {
                    ...d,
                    documents: d.documents.map((doc) =>
                        doc.id === docId ? { ...doc, status: 'rejected' as DocumentStatus } : doc
                    ),
                }
                : d
        );
        setState({ drivers });
    };

    // Passenger actions
    const suspendPassenger = (passengerId: string) => {
        const passengers = currState.passengers.map((p) =>
            p.id === passengerId ? { ...p, status: 'suspended' as PassengerStatus } : p
        );
        setState({ passengers });
    };

    const activatePassenger = (passengerId: string) => {
        const passengers = currState.passengers.map((p) =>
            p.id === passengerId ? { ...p, status: 'active' as PassengerStatus } : p
        );
        setState({ passengers });
    };

    // Promo code actions
    const addPromoCode = (code: Omit<PromoCode, 'id' | 'currentUses'>) => {
        const newCode: PromoCode = {
            ...code,
            id: `promo${Date.now()}`,
            currentUses: 0,
        };
        setState({ promoCodes: [...currState.promoCodes, newCode] });
    };

    const togglePromoCode = (promoId: string) => {
        const promoCodes = currState.promoCodes.map((p) =>
            p.id === promoId ? { ...p, isActive: !p.isActive } : p
        );
        setState({ promoCodes });
    };

    // Safety actions
    const updateIncidentStatus = (incidentId: string, newStatus: SafetyIncident['status']) => {
        const safetyIncidents = currState.safetyIncidents.map((s) =>
            s.id === incidentId ? { ...s, status: newStatus } : s
        );
        setState({ safetyIncidents });
    };

    // Document management actions
    const addRequiredDocument = (doc: Omit<RequiredDocument, 'id'>) => {
        const newDoc: RequiredDocument = {
            ...doc,
            id: `rd${Date.now()}`,
        };
        setState({ requiredDocuments: [...currState.requiredDocuments, newDoc] });
    };

    const updateRequiredDocument = (doc: RequiredDocument) => {
        const requiredDocuments = currState.requiredDocuments.map((d) =>
            d.id === doc.id ? doc : d
        );
        setState({ requiredDocuments });
    };

    const deleteRequiredDocument = (docId: string) => {
        const requiredDocuments = currState.requiredDocuments.filter((d) => d.id !== docId);
        setState({ requiredDocuments });
    };

    return {
        ...currState,
        getStats,
        getDriverById: (id: string) => currState.drivers.find((d) => d.id === id),
        getPassengerById: (id: string) => currState.passengers.find((p) => p.id === id),
        approveDriver,
        suspendDriver,
        activateDriver,
        approveDocument,
        rejectDocument,
        suspendPassenger,
        activatePassenger,
        addPromoCode,
        togglePromoCode,
        updateIncidentStatus,
        addRequiredDocument,
        updateRequiredDocument,
        deleteRequiredDocument,
    };
};
