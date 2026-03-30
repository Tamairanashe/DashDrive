/**
 * usePermissions Hook
 * Maps merchant role → allowed UI sections and actions.
 * Used in both Mart Merchant Portal and DashFood Manager.
 */

export interface Permissions {
    dashboard: boolean;
    orders: boolean;
    inventory: boolean;
    financials: boolean;
    settings: boolean;
    staff: boolean;
    marketing: boolean;
    reports: boolean;
}

// Default permission matrix by role
const ROLE_PERMISSIONS: Record<string, Permissions> = {
    Owner: {
        dashboard: true, orders: true, inventory: true,
        financials: true, settings: true, staff: true,
        marketing: true, reports: true,
    },
    Admin: {
        dashboard: true, orders: true, inventory: true,
        financials: false, settings: true, staff: false,
        marketing: true, reports: true,
    },
    Manager: {
        dashboard: true, orders: true, inventory: true,
        financials: false, settings: false, staff: false,
        marketing: false, reports: true,
    },
    Staff: {
        dashboard: true, orders: true, inventory: false,
        financials: false, settings: false, staff: false,
        marketing: false, reports: false,
    },
    Analyst: {
        dashboard: true, orders: false, inventory: false,
        financials: false, settings: false, staff: false,
        marketing: false, reports: true,
    },
};

export function usePermissions(merchant: any) {
    const role: string = merchant?.role || 'Staff';

    // Use server-provided permissions if available, otherwise fall back to defaults
    const permissions: Permissions = merchant?.permissions || ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Staff'];

    return {
        role,
        permissions,
        canViewDashboard: permissions.dashboard,
        canManageOrders: permissions.orders,
        canManageInventory: permissions.inventory,
        canViewFinancials: permissions.financials,
        canManageSettings: permissions.settings,
        canManageStaff: permissions.staff,
        canManageMarketing: permissions.marketing,
        canViewReports: permissions.reports,
        isOwner: role === 'Owner',
        isAdmin: role === 'Admin' || role === 'Owner',
    };
}
