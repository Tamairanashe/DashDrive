---
description: How to seed the Driver Management Hub with comprehensive mock data
---

# Seeding Mock Driver Data

This workflow details the procedure for populating the **Driver Management Hub** with test data across all operational tabs (List, History, Wallet, Documents, etc.).

## 1. Local Data Seeding (Manual)
To add a specific driver for testing:
1. Open [DriverManagementHub.tsx](file:///c:/Users/jchit/Desktop/Services/DashDrive/dashdrive-admin-panel/src/pages/DriverManagementHub.tsx).
2. Locate the `drivers` state variable (around Line 62).
3. Append a new object to the array:
   ```javascript
   { 
     id: 'DR-TEST-001', 
     name: 'Test Partner', 
     status: 'Active', 
     city: 'Harare', 
     walletBalance: 100.00,
     trips: 10,
     joinDate: 'Jan 2024',
     // ... other fields
   }
   ```
4. Save the file. The Vite dev server will hot-reload the changes.

## 2. Automated Mock Generation
// turbo
To instantly seed the hub with 10+ randomized profiles:
1. Open the [Driver Management Hub](http://localhost:3000/drivers/list) in your browser.
2. Click the **"Internal: Seed Mocks"** button in the top-right header (available in Dev mode).
3. This will trigger the `seedMockDrivers()` function, which populates:
   - **Driver List**: Diverse set of statuses (Active, Offline, Frozen).
   - **Trip History**: Completed and Cancelled records.
   - **Financial Ledger**: Withdrawal and Earnings logs.
   - **Compliance**: Verified and Rejected document statuses.

## 3. Verifying the Data
Navigate through the following tabs to ensure the mock substrate is applied correctly:
- **Driver List**: Verify ID, Tier, and Wallet balance rendering.
- **Documents**: Verify filter by "Verified" / "Pending".
- **Trips**: Verify route display (Pickup -> Dropoff).
- **Ratings**: Verify Average Rating precision and Feedback list.
- **Activity Logs**: Verify Audit trail of mock events.

## 4. Cleaning Up
To revert to a clean state:
1. Use the **"Trash"** drawer in the driver hub (Top-right button).
2. Or refresh the page to reset the local `useState` buffers (if no persistence implemented).
