# DashDrive Admin Panel: Services & Tabs Guide

This document provides a comprehensive overview of the DashDrive Admin Panel, explaining each main navigation tab and the underlying backend services that power them.

---

## 🚀 Frontend Navigation Tabs

The Admin Panel is organized into several key domains, each containing specific tabs for managing different aspects of the DashDrive ecosystem.

### 1. Dashboard Domain
*   **Main Dashboard**: High-level overview of system performance, active trips, and key metrics.
*   **Heatmap**: Real-time visual representation of demand and driver distribution using Google Maps.
*   **Fleet View**: Monitoring active vehicles and their status across different regions.
*   **Analytics**: In-depth reporting on business KPIs, user growth, and service performance.

### 2. Market Heatmap
The **Heatmap** is the tactical center for supply-demand balancing. It visualizes:
- **Demand Intensity**: Color-coded zones representing user request volume.
- **Active Assets**: Real-time driver/courier locations.
- **AI Surge Control**: Global and zone-specific surge multipliers.

> [!TIP]
> Refer to the specialized [Heatmap System Documentation](file:///c:/Users/jchit/Desktop/Services/DashDrive/docs/heatmap_system.md) for detailed architectural and operational guides.

### 3. Live Tracking
Real-time tracking of active trips and driver movements.

### 4. Services Domain
This section manages the various service offerings provided by DashDrive:
*   **Ride Hailing**: Standard taxi and private hire service management.
*   **Food Delivery**: Management of restaurant partners and food delivery orders.
*   **Mart Delivery**: Grocery and convenience store delivery service management.
*   **Shopping**: Personal shopping and concierge service configuration.
*   **Parcel**: Point-to-point package delivery service management.
*   **Hotels & Events**: Integration with marketplace services for booking accommodations and event tickets.
*   **Car Rental**: Management of vehicle rentals for users.
*   **City-to-City**: Long-distance transport service management.
*   **School Run**: Specialized monitoring for student transportation services.
*   **Payments & Fintech**: Management of built-in financial services:
    *   **Loans**: Credit products for drivers and partners.
    *   **Insurance**: Micro-insurance products for trips and vehicles.
    *   **KYC**: Identity verification workflows for all participants.

### 3. Partner & User Management
*   **Driver Management**: Full lifecycle management of drivers, including verification, rewards, leaderboards, and tier setups.
*   **Courier Management**: Specific workflows for delivery personnel, including earnings and performance tracking.
*   **Fleet Management**: Tools for fleet operators to manage their vehicles and drivers.
*   **User Management**: Managing registered customers, employee roles, and user wallets.

### 4. Operations
*   **Operations Hub**: Central command for managing active operations.
*   **Zone Setup**: Defining geographical boundaries (geofencing) for service availability and pricing.
*   **Dispatch Management**: Manual and automated dispatching rules and overrides.
*   **Surge Pricing**: Configuring dynamic pricing based on demand and supply in specific zones.
*   **Traffic Insights**: Analyzing traffic patterns to optimize routing and ETA.

### 5. Vehicle Management
*   **Vehicle List**: Inventory of all registered vehicles in the system.
*   **Vehicle Attributes**: Managing vehicle types, categories (e.g., Economy, Business, XL), and features.
*   **Registration Requests**: Processing new vehicle applications from partners and drivers.

### 6. Marketing & Growth
*   **Marketing Hub**: managing banners, notifications, and newsletters.
*   **Coupons & Discounts**: Creating and managing promotional codes and loyalty discounts.
*   **Growth Engine**: Automated marketing campaigns driven by user behavior analytics.

### 7. Finance
*   **Fare Management**: Configuring base fares, per-km rates, and wait time charges.
*   **Transactions & Earnings**: Detailed logs of all financial movements within the platform.
*   **Commissions**: Setting and adjusting platform fee structures for different services and regions.
*   **Settlements**: Managing payouts to drivers, merchants, and fleet partners.

### 8. Support & Quality
*   **Support Hub**: Managing customer and partner support tickets and inquiries.
*   **Reputation Management**: Monitoring user reviews, feedback, and moderation of content.
*   **Technical Resolution**: Handling system-level issues and bug reports from the field.

---

## ⚙️ Backend Services (Modules)

The `dashdrive-mobility-backend` is built with a modular architecture, where each module handles a specific domain of the business logic.

*   **`auth`**: Handles user authentication, authorization, and session management.
*   **`city-to-city`**: Business logic for long-distance, inter-city transport.
*   **`dispatch`**: The core engine for matching trips with available drivers and couriers.
*   **`exports`**: Utility service for generating reports (PDF, CSV) from various modules.
*   **`financials`**: Manages the core ledger, wallet balances, and transaction history.
*   **`local-rides`**: Core logic for standard ride-hailing services.
*   **`orders`**: Management of delivery orders (Food, Mart, Parcel).
*   **`regions`**: Manages geographical definitions, time zones, and regional configurations.
*   **`roads-insights-export`**: Specialized service for exporting traffic and road condition data.
*   **`trips`**: Lifecycle management of a trip (from request to completion).
*   **`vehicles`**: Logic for vehicle registration, verification, and attribute management.
*   **`trust`**: Safety and security modules, including SOS features and emergency response.
*   **`inspections`**: Workflows for periodic vehicle and partner facility inspections.
*   **`hosting`**: Management of physical assets or hubs within the logistics network.
