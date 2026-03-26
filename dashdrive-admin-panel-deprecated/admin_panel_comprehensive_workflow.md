# DashDrive Admin Panel: Comprehensive Workflow Guide

This guide covers the administrative workflow from the initial Dashboard entry to the final System Settings, detailing the flow, functions, and interactions within each major section.

---

## 1. Executive Overview (MAIN)
**Flow**: Dashboard â†’ Analytics â†’ Fleet View
**Purpose**: High-level system health monitoring.

### Dashboard
- **Functions**: Real-time GMV tracking, active order count, and service-specific performance grid.
- **Interactions**:
  - **Hierarchical Filters**: Select Country > Region > City to scope the entire dashboard.
  - **KPI Cards**: Clickable cards (Revenue, Orders, Verification) that navigate to deeper modules.
  - **Live Activity Hub**: Mini-map showing real-time driver/customer density.
  - **Service Performance**: Interactive grid with tooltips explaining "Optimal" vs "Delayed" status.

### Fleet View & Heat Map
- **Functions**: Visualizing supply vs demand.
- **Interactions**: Toggle between "Heat Map" (demand density) and "Fleet View" (individual driver tracking).

---

## 2. Core Operations (OPERATIONS)
**Flow**: Operations Hub â†’ Zone Setup â†’ Dispatch Management
**Purpose**: Day-to-day management of the mobility platform.

### Operations Hub
- **Functions**: The "Command Center" for active incidents and platform pulse.
- **Interactions**:
  - **Pulse Sync**: Standardizes local state with the mobility stream.
  - **Manual Dispatch Override**: A high-privilege toggle to bypass automated matching.
  - **Quick Broadcast**: Send emergency alerts to all drivers/customers in a specific zone.

### Zone Setup
- **Functions**: Defining operational boundaries and surge pricing areas.
- **Interactions**:
  - **Drawing Tools**: Click-to-draw Polygons, Circles, and Triangles on the map.
  - **Trash/Restore**: A safety workflow for deleted zones before permanent removal.
  - **Export**: Generate CSV of all geofence coordinates for external GIS tools.

---

## 3. Financial Ecosystem (FINANCE)
**Flow**: Fare Management â†’ Financial Reports Hub â†’ Settlements
**Purpose**: Revenue collection, tax compliance, and partner payouts.

### Financial Reports Hub
- **Functions**: The "Master Ledger" of the platform.
- **Tabs**: Earnings, Expenses, Transactions, Tax, Refunds, Wallets, Reconciliation.
- **Interactions**:
  - **Deep Linking**: Tabs are synced with URL parameters (e.g., `?tab=reconciliation`) for easy sharing between finance team members.
  - **Reconciliation Flow**: Compare internal transaction IDs against external gateway (Stripe/PayPal) responses.
  - **Wallet Actions**: Manually add/debit funds or "Freeze" accounts for audit.

---

## 4. Administrative Control (ENTERPRISE)
**Flow**: Business Setup â†’ Access & Governance â†’ System Settings
**Purpose**: Platform configuration and security.

### Access & Governance (Roles)
- **Functions**: Granular Permission Based Access Control (PBAC).
- **Interactions**:
  - **Role Matching**: Select a Role (e.g., "Logistics Manager") to automatically highlight all permitted modules.
  - **Granular Toggle**: Over 23 specific service modules can be enabled/disabled per role.
  - **Audit Log**: View the last active timestamp and specific actions performed by each employee.

### System Settings
- **Functions**: Global constants and integration keys.
- **Interactions**:
  - **Gateway Configuration**: Manage API keys for Maps, Payment Processors, and SMS providers.
  - **Platform Constants**: Setting global commission rates, minimum fare bases, and tax percentages.

---

## Summary of Interaction Patterns
- **Standardized Search**: All lists feature a global top-right search and multi-select filters.
- **State Consistency**: Most pages feature a "Sync" or "Refresh" button that triggers a socket-level update.
- **Safe Deletion**: A "Trash" logic is implemented across Users, Drivers, and Zones to prevent accidental data loss.
- **Responsive Navigation**: The sidebar supports both expanded (with labels) and collapsed (icon-only) modes for different screen sizes.

---
*Note: This guide represents the logical flow of the DashDrive Admin Panel as of the current implementation.*
