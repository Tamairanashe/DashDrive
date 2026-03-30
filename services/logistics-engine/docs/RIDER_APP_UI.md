# DashDrive Rider Super-App — UI & Navigation Architecture

This document defines the unified "Super-App" experience for DashDrive riders, integrating transportation, logistics, and commerce into a single, high-conversion interface.

---

## 🧭 Navigation Model (Bottom Bar)
- **Home**: The Super-App Hub.
- **Activity**: Past orders, rides, and re-ordering.
- **Wallet**: Payment methods and balances.
- **Messages**: Chat with drivers, merchants, and support.
- **Account**: Profile, settings, and addresses.

---

## 🏠 1. Home Screen (Super-App Hub)
- **Search Bar**: "Where are you going?" (Global search for destinations, products, or food).
- **Service Grid (The Big 5)**:
    - **[RIDE]** | **[PARCEL]**
    - **[FOOD]** | **[MART]**
    - **[SHOPPING]**
- **Feed**: Hero promos, nearby trending restaurants, and "Buy again" suggestions.

---

## 🚕 2. Ride Booking (Bidding Model)
1. **Route Input**: Pickup & Destination selector + Map preview.
2. **Price Suggestion**:
    - **Suggested**: $8.00 (Market-based).
    - **Minimum**: $5.00 (Floor).
    - **User Bid Slider**: Interactive slider to adjust the offer.
3. **Driver Bidding Wall**: Real-time cards showing driver offers (e.g., "Driver Ahmed | Top Rated | 3 min | $6.00").

---

## 📦 3. Parcel Delivery
- **Flow**: Pickup -> Drop-off -> Parcel Details (Small, Medium, Large).
- **Pricing**: User offers a bid; nearby couriers respond with counter-offers.

---

## 🍕 4. Food & Mart Delivery (Instant Dispatch)
- **Discovery**: Store lists with filters for rating, delivery time, and cuisine.
- **Cart & Checkout**: Unified cart with item totals and delivery fees.
- **Dispatch**: Automatically assigned to the best-scored courier in the vicinity.

---

## 🛒 5. Shopping (Personal Shopper)
- **Request**: User specifies a store and item (e.g., Electronics Store -> Phone Charger).
- **Fulfillment**: Driver purchases the item and delivers it to the user.

---

## 📍 6. Unified Live Tracking
All active services (Rides, Food, Parcels) appear in a **Live HUD tracker** on the map.
- **Status Lifecycle**: Finding Driver -> Arriving -> In Progress -> Completed.
- **Verification PIN**: The rider sees a 4-digit PIN (e.g., `8842`) to confirm drop-off.

---

## 💳 7. Wallet & Payments
- **Unified Balance**: Supports cards, mobile money, and platform wallet.
- **Transaction Audit**: Integrated view of ride spend vs. food/mart spend.

---

## 💬 8. Messages & Support
- **In-App Chat**: Direct communication with drivers/couriers (e.g., "I'm arriving in 2 minutes").
- **Support Inbox**: History of help tickets and dispute resolutions.

---

## ✅ Design Principles
- **Frictionless Transitions**: Consistent header and navigation across all verticals.
- **Visibility**: Large buttons and clear pricing for "Eyes on the Go" usability.
- **Trust Indicators**: Prominent driver ratings and safety tools (SOS/Trip Sharing).
