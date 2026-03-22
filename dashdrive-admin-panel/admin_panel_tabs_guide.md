# DashDrive Admin Panel: Tabs & Navigation Guide

This document describes the various tab groups used in the DashDrive Admin Panel, their associated components, and the functionality each tab provides.

## 1. Operations & Logistics

### Zone Setup (`ZoneSetup.tsx`)
Controls the geofencing and operational boundaries.
- **All**: Displays all defined zones (Polygons, Circles, Triangles).
- **Active**: Filters for zones currently enforced in the system.
- **Inactive**: Displays disabled zones for review or future activation.

### Trips Management (`Trips.tsx`)
The central hub for tracking movement on the platform.
- **All**: View all historical and current missions.
- **Ongoing**: Real-time tracking of active trips.
- **Completed**: Archive of successful deliveries/rides.
- **Cancelled**: Log of aborted missions for audit.
- **Scheduled**: Future bookings awaiting dispatch.

### Vehicle Management (`VehicleManagement.tsx`)
Fleet oversight and configuration.
- **Vehicles**: Active fleet list with status indicators.
- **Attributes**: Management of vehicle types (Luxury, Economy, WAV).
- **Requests**: Maintenance and onboarding inquiries.
- **Settings**: Global fleet parameters (speed limits, age restrictions).

## 2. Support & Performance

### Support Triage (`SupportTriage.tsx`)
Management of the help desk and incident response.
- **Active Tickets**: Unresolved issues requiring agent attention.
- **Agents**: Real-time status of support staff (Online/Offline).
- **Performance**: SLA metrics, response times, and customer satisfaction.
- **Settings**: Triage rules and auto-assignment logic.

### Leaderboard (`Leaderboard.tsx`)
Gamification and driver ranking.
- **Daily / Weekly / Monthly**: Performance filtering based on earnings, rating, or completed trips.

## 3. Financial Management

### Withdraw Requests (`WithdrawRequests.tsx`)
Payout pipeline for drivers and partners.
- **Pending**: New requests awaiting verification.
- **Approved**: Verified requests queued for payment.
- **Rejected**: Disqualified requests with reason codes.
- **Processed**: Finalized transactions.

### Finance Reports (`FinanceReports.tsx`)
Revenue and commission analytics.
- **Overview**: High-level financial health.
- **Earn Reports**: Gross earnings breakdown.
- **Comm Reports**: Platform commission and tax tracking.
- **Analytics**: Trend analysis and forecasting.

## 4. Growth & Marketing

### Marketing Hub (`MarketingHub.tsx`)
Tools for user acquisition and retention.
- **Campaigns**: Management of active ads and promos.
- **Audiences**: Segementation of customers for targeted messaging.
- **Vouchers**: Creation and distribution of discount codes.
- **Notifications**: Bulk push and SMS management.

## 5. User & Business Configuration

### Customer Details (`CustomerDetails.tsx`)
Deep dive into a specific user's profile.
- **Overview**: Basic info, wallet balance, and trust score.
- **History**: List of previous interactions and trips.
- **Support**: History of tickets raised by this user.
- **Review**: Ratings and feedback provided/received.

### Business Config (`BusinessConfig.tsx`)
Enterprise-level settings.
- **Business Setup**: Profile and branding.
- **Configuration**: Service-specific toggles (e.g., Food vs Ride).
- **Roles & Permissions**: Internal staff access control.
- **Settings**: General system preferences.

---
*Implementation Note: All tab groups listed above are generated dynamically using the `.map()` function on fixed configuration arrays, ensuring UI consistency across the admin panel.*
