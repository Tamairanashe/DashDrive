# DashDrive Driver App — Full UI & Navigation Architecture

This document defines the 5-section navigation structure and interactive states for the DashDrive Driver App, ensuring a professional, high-performance experience for multi-service logistics.

---

## 🧭 Main Navigation (Bottom Bar)
1. **Home**: Dashboard, Online/Offline toggle, Real-time demand.
2. **Trips**: Current active job queue.
3. **Wallet**: Ride credits, Earnings, Recharge.
4. **Activity**: Historical audit trail.
5. **Account**: Profile, Vehicle, Support.

---

## 🏠 1. Home Screen (The Operations Hub)
- **Status Switch**: Large toggle for ONLINE / OFFLINE.
- **Top Stats Card**:
    - **Today's Earnings**: $42.50 [Main visual focus]
    - **Ride Credits**: 6 remaining [Color-coded: Green/Yellow/Red]
- **Demand Map**: Dynamic heatmap showing orange/red hotspots for surge pricing.
- **Next Nudge**: "High demand 2km away. Estimated $12/hr. [Navigate]"

---

## 🔔 2. Incoming Request Screen (Decision Logic)
Displays critical job data for Rides, Parcels, or Deliveries.
- **Ride**: Pickup Distance (1.2 km), Destination, Passenger Offer Price ($6).
- **Parcel**: Size (Small/Medium/Large), Pickup Point, Drop-off Zone, Fee ($5).
- **Interactions**:
    - **ACCEPT**: Commits to the job (Credits reserved).
    - **COUNTER**: Opens negotiation (Rides/Parcels).
    - **DECLINE**: Skips the job, allows sequential or broadcast flow to continue.

---

## 🗺️ 3. Active Trip Screen (Execution & Safety)
Focuses on safe navigation and trip integrity.
- **Real-time Map Integration**: Integrated Layer for turn-by-turn guidance.
- **Trip Metadata**: Passenger/Customer name, destination, ETA, distance.
- **Verification**: **Start Trip** -> **Enter Verification PIN** (Step 14 Safeguard).
- **Safety Bar**: SOS Button, "Share Trip Status" link, Support Chat.

---

## 💳 4. Wallet Screen (Prepaid Economics)
Transparency for the Ride Credit model is central to driver retention.
- **Credit Balance**: 6 rides remaining.
- **Top-up Package Menu**:
    - **Starter**: $10 → 8 rides
    - **Basic**: $20 → 17 rides
    - **Standard**: $40 → 36 rides
    - **Pro**: $80 → 75 rides
- **Recharge History**: Past top-ups and expiry dates.

---

## 📊 5. Activity & Earnings Dashboard
Historical view for driver performance audit.
- **Shift Summary**:
    - Total Trips Completed.
    - Total Earnings (100% Retained).
    - Credits Consumed.
- **Detailed History**: `[Date] | [Job Type] | [Fare Retained] | [Credit Consumed]`

---

## 🛡️ Anti-Cheating & Integrity (Step 14 Integration)
- **PIN Verification**: Mandatory 4-digit PIN entry to confirm passenger pickup/drop-off.
- **Threshold Safeguards**: Automatic flags for trips <0.5km or <3min duration.
- **Integrity Score**: Visual fraud score indicator in the "Account" section for driver awareness.

---

## ✅ Design Principle: "Eyes on Road"
- **High-Contrast Typography**: Readable in direct sunlight.
- **Oversized Hit Areas**: Big buttons for "Accept" or "End Trip" to allow safe interaction.
- **Voice Feedback (Optional)**: Audio notifications for new requests or balance warnings.
