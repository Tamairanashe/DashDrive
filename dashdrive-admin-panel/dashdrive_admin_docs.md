# DashDrive Admin Panel - Comprehensive Documentation

## 1. Executive Summary
DashDrive is an omni-channel mobility and delivery platform designed for scale. The Admin Panel is the central nervous system of the ecosystem, providing real-time visibility and control over multiple verticals including **Ride Hailing, Food Delivery, Mart, Shopping, Parcel, Hotels, Events, and Car Rentals**.

Built with a modern stack featuring **React, Ant Design (AntD), Recharts, and Google Maps API**, the admin panel handles live data streams via **Socket.io** to provide second-by-second updates on fleet movement, operational health, and financial transactions.

---

## 2. Navigation & Architecture
The application uses a **Sidebar-driven navigation** hierarchy grouped into logical domains:

*   **MAIN**: Core dashboards and analytics.
*   **SERVICES**: Management hubs for each business vertical.
*   **PARTNERS & FLEET**: Onboarding and management of drivers, couriers, and fleet operators.
*   **USERS**: Customer profiles, loyalty tiers, and wallet management.
*   **OPERATIONS**: Live platform monitoring, geofencing, and dispatch control.
*   **FINANCE**: Earnings reporting, settlements, and fare management.
*   **MARKETING**: Growth engines, coupons, and notification campaigns.
*   **QUALITY & TRUST**: Reputation management and moderation.
*   **SUPPORT**: Multi-channel ticket and chat hub.
*   **ENTERPRISE & SYSTEM**: High-level governance, API management, and core environment settings.

---

## 3. Core Modules Breakdown

### 3.1 Main Dashboard & Analytics
The primary entry point of the application, designed for executive-level oversight.
*   **KPI Widgets**: Real-time tracking of Today's Revenue, Active Trips, Pending Orders, and Online Drivers.
*   **Service Performance Grid**: Comparative view of performance across all verticals (Ride vs. Food vs. Mart).
*   **Heat Map**: Visualization of demand and supply density. Integrated with **Google Weather API** and AI-driven insights to predict demand spikes.
*   **Fleet View**: Global tracking of all active entities (Drivers, Customers, Deliveries) on an interactive map.

### 3.2 Services Management
Each platform vertical has its own dedicated configuration and management hub:
*   **Ride Hailing**: Manage pricing engines (base fare, distance/time rates), vehicle capacity, and surge rules.
*   **Food & Mart**: Vendor onboarding, menu cataloging, and inventory management.
*   **Marketplace (Hotels & Stays)**: Listing management, availability calendars, and booking tracking.
*   **Car Rental**: Fleet availability, documentation check, and rental duration pricing.
*   **Service Config**: A centralized hub to define **Commission Rates** (Platform Fee) and base fees for all services.

### 3.3 Partners & Fleet Ecosystem
The lifecycle management of the platform's supply side.
*   **Driver Management**: 
    *   **Registry**: Full list of active and pending drivers.
    *   **Verification**: Multi-stage document review (License, Insurance, Identity).
    *   **Retention**: Loyalty tiers (Novice, Bronze, Gold, Elite) and rewards engine based on performance.
*   **Courier & Fleet Operators**: Tools for external company partners to manage their own subsets of drivers and earnings.
*   **Vehicle Management**: 
    *   **Registry**: VIN tracking, model/make management.
    *   **Attributes**: Define high-value features (AC, Luxury, High Capacity) that influence pricing.

### 3.4 Operations Hub
The "Mission Control" for daily platform activities.
*   **Zone Setup (Geofencing)**: Draw custom polygons on the map to define operational boundaries, surge zones, or restricted areas.
*   **Dispatch Management**: Automated and manual trip assignment control.
*   **Live Tracking & Active Alerts**: Real-time safety monitoring. High-risk events (sudden stops, SOS alerts) are escalated here.
*   **Traffic Insights**: Powered by AI to suggest routing optimizations based on city-wide road performance.

### 3.5 Finance & Fintech Hub
A high-integrity ledger system for platform economy.
*   **Financial Reports Hub**: Deep-dive into Earnings, Expenses, Cash flow, Tax compliance, and Treasury.
*   **Fare Management**: Dynamic pricing rules based on time of day, weather, and demand.
*   **Settlements**: Automated payout processing for drivers and merchants. Supports bank transfers and wallet settlements.
*   **Fintech Partner Hub**: Integration with 3rd party providers for loans (BNPL), insurance products, and utility payments.
*   **Dash Wallet**: Internal virtual ledger for instant transfers and platform credit management.

### 3.6 Marketing & Growth
Tools for user acquisition and retention.
*   **Coupon & Discount Engine**: Create complex promo rules (e.g., "GET50OFF for Food orders > $20").
*   **Banner Setup**: CMS for mobile app home screen real estate.
*   **Growth Engine**: Referral management and viral growth loop tracking.
*   **Notifications Hub**: Send targeted Push, SMS, and Email campaigns based on user behavior.

### 3.7 Quality, Support & Content
Ensuring platform integrity and user satisfaction.
*   **Reputation Management Hub**: 
    *   **Reviews & Ratings**: Sentiment analysis of customer feedback.
    *   **Moderation Queue**: AI-assisted filtering of reported content or abusive behavior.
*   **Support Hub**:
    *   **Tickets**: Multi-category ticket management (Account, Order, Payment).
    *   **Live Chat**: Direct real-time communication with drivers and customers.
    *   **Technical Resolution**: L2 console for engineering-level deep dives into system errors.

### 3.8 Enterprise & System Settings
Core governance and technical configuration.
*   **Governance**: Role-based access control (RBAC), Audit logs for every admin action, and API key management.
*   **Environment Setup**: DB connection strings, App URLs, and server-side modes (Production/Staging).
*   **Version Control**: Manage mobile app update requirements (Force Update, Maintenance Mode).
*   **Database Cleanup**: A "Danger Zone" utility for purging temporary logs and maintaining system performance.

---

## 4. Technical Architecture Overview

### 4.1 State & Theme Management
*   **Context API**: Used for Global Authentication and Application-wide Theming.
*   **Dark Mode**: Native support for dark/light modes with unified token-based styling.

### 4.2 Real-time Sync
*   **Socket.io**: Enables bi-directional communication. The UI listens for events like `SUPPORT_TICKET_CREATED`, `ORDER_PLACED`, or `DRIVER_SOS` to update the dashboard without page refreshes.

### 4.3 Navigation & Routing
*   **React Router v6**: Handles complex nested routing.
*   **Protected Routes**: Integrated with the `AuthContext` to ensure only verified admin users access sensitive domains (Finance/System Settings).

---

*Generated for the DashDrive Engineering and Operations Teams.*
