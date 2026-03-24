# DashDrive Admin Panel: Tab-by-Tab Testing Workflow

This document provides a structured guide for testing each tab and page within the DashDrive Admin Panel using mock data. The goal is to verify UI layout, navigation, and visual feedback.

---

## 🚦 Phase 1: Dashboard Domain
- [ ] **Main Dashboard**: Verify KPI cards (Revenue, Trips, Users) display mock values and sparklines.
- [ ] **Heatmap**: Ensure the Google Maps instance loads and displays mock driver/demand clusters.
- [ ] **Fleet View**: Check the interactive vehicle list and map markers for mock vehicles.
- [ ] **Analytics**: Verify that charts (Recharts) render correctly with the mock datasets provided in the components.
- [ ] **Live Tracking**: Ensure the real-time tracking simulation is visible on the map.

## 🍔 Phase 2: Services Domain
- [ ] **Ride Hailing**: Check the status-based lists (Active, Pending, Completed).
- [ ] **Food Delivery**: Verify merchant lists and order tracking views.
- [ ] **Mart & Shopping**: Confirm that product/order categories display correctly.
- [ ] **Fintech Hub**:
    - [ ] **Loans**: Review sample loan applications and status tags.
    - [ ] **Insurance**: Check mock policy lists.
    - [ ] **Wallets**: Verify transaction logs and balance summaries.

## 👥 Phase 3: Management & Operations
- [ ] **Driver Management**: Navigate through the 'List', 'Verification', and 'Rewards' tabs.
- [ ] **User Management**: Verify the Customer and Employee tabs display mock user profiles.
- [ ] **Operations Hub**: Check the 'Zones' tab to ensure geofencing visuals are working.
- [ ] **Support Hub**: Test the 'Live Chat' and 'Ticket' drawers with mock conversations.

## 📣 Phase 4: Marketing & Finance
- [ ] **Marketing**: Verify Banner, Coupon, and Discount lists. Ensure 'Trash' and 'Audit' drawers open.
- [ ] **Finance**: Check Fare configurations and Settlement lists. Verify the 'Financial Reports' hub summaries.

---

## 🛠️ Testing Procedure per Page:
1.  **Navigation**: Reach the page via the sidebar or direct URL.
2.  **Layout Check**: Ensure Ant Design components (Cards, Tables, Tabs) are properly aligned.
3.  **Data Presence**: Confirm that no "Empty" icons appear in areas where mock data should be present.
4.  **Interaction**: Click on "View Details", "Edit", or "Delete" buttons to verify drawer/modal triggers.
5.  **Responsiveness**: (Optional) Verify the layout on different screen widths using browser dev tools.
