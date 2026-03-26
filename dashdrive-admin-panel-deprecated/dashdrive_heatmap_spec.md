# DashDrive Market Intelligence Heat Map: Technical & Product Specification

## 1. Vision & Core Philosophy
The DashDrive Heat Map is not just a visual representation of density—it is a live **Decision Engine** and **Spatial Model** designed for operations, pricing, and dispatch intervention.

It answers five critical operational questions in real-time:
1. Where is demand rising faster than supply?
2. Where is available supply severely depleted?
3. Where are ETAs inflating beyond SLA baselines?
4. Where should surge/incentives be applied to stabilize the network?
5. Which zones are experiencing critical failures (cancellations/incidents)?

---

## 2. Page Layout & UI Architecture

### 2.1 Top Header (Global Controls)
* **Title:** Market Intelligence Hub
* **City Selector:** Dropdown (e.g., Harare, Bulawayo)
* **Service Context Selector:** Ride Hailing | Food Delivery | Parcel | Groceries
* **Timeframe Control:** Live (WebSocket) | Historical (Last 24h, Custom Range) | Compare Mode
* **Status Indicator:** Live / Paused / Syncing
* **Global Refresh / Sync Force Button**

### 2.2 Global Metrics Ribbon (Top Row Charts)
Horizontal statistical cards instantly summarizing the selected city/service:
* **Active Requests:** Real-time incoming count (Sparkline: last 60m).
* **Available Supply:** Idle online drivers/couriers.
* **Network Imbalance Ratio:** Target is 1:1. >1 implies demand pressure.
* **Average Pickup ETA:** City-wide average vs baseline.
* **Cancellation Rate:** Rolling 5-minute rider + driver cancel rate.
* **Active Surge / Incentives:** Number of zones currently surged or incentivized.

### 2.3 Layer Control Sidebar (Left Panel)
Toggles for viewing the "City-State" grid natively over the map.
* **Demand Intensity** (Raw request count)
* **Supply Index** (Idle + Active partners)
* **Imbalance Matrix** (Ratio of Demand to Supply) --- *Default & Primary View*
* **ETA Pressure** (Wait time deviations)
* **Failure Hotspots** (Cancellations, timeouts)
* **Surge Status** (Multiplier zones)
* **Revenue Density** (GMV per cell)
* **Alerts / Incident Overlay** (SOS, Traffic blocks)

### 2.4 The Main Spatial Map (Center Canvas)
* **H3 Hexagonal Grid (Live Analytics):** Rendered dynamically for high-resolution density tracking.
* **Admin Zone Polygons (Business Rules):** Aggregated operational zones for surge and dispatch rules.
* **Marker Overlays:** Individual driver/courier locations (hidden at high zoom levels, clustered at low levels).
* **Hover Tooltip:** Hovering a hex/zone shows immediate `Supply/Demand Ratio`, `Current Surge`, and `Avg ETA`.

### 2.5 Zone Insights & Action Drawer (Right Panel)
Activates when an H3 cell or Admin Zone is clicked.
**Data Readouts:**
* Real-time counters: Pending Requests, On-Trip, Idle Drivers.
* Metrics: ETA (current vs norm), Cancellation %, Conversion rate.
* Trend Graph: 1-hour rolling view of Demand vs Supply.
* Heat Score: `Low | Medium | High | Critical`

**Operational Actions (Triggers):**
* `Deploy Surge Multiplier` (e.g., 1.5x)
* `Broadcast Supply Incentive` (e.g., +$2.00 per trip)
* `Widen Dispatch Radius`
* `Open Dispatch Queue` (Deep link to active trip monitoring)
* `Trigger Fleet Operator Alert`

### 2.6 Deep Analytics & Charts (Bottom Expandable Drawer)
* **Demand vs Supply Chart:** Multi-line graph showing requests versus online fleet over time.
* **ETA Inflation Trend:** Line chart of service degradation.
* **Top 10 Problem Zones List:** Auto-ranked list of zones needing intervention (highest imbalance score). 
* **Surge Impact Chart:** Visualizing how supply responded X minutes after a surge was applied.

---

## 3. Data Model & Scoring Algorithms

### 3.1 The Heat Score Equation
To determine if a zone should render as Red/Critical, we calculate the `Market_Pressure_Score`.

```pseudocode
heat_score = 
    (normalized_requests * 0.35) 
  + (eta_inflation * 0.20) 
  + (cancellation_rate * 0.15) 
  - (idle_supply * 0.30)
```
*Categories:*
* **< 20:** Healthy (Green)
* **21 - 40:** Rising Pressure (Yellow)
* **41 - 70:** Supply Shortage / High Demand (Orange)
* **> 70:** Critical Failure / Gridlock (Purple)

*(Note: Weights adjust dynamically based on the selected Service Type. Food Delivery weighs Prep Time heavily; Ridel Hailing weighs Pickup ETA).*

### 3.2 H3 Cell Overlays (Data Grain)
Instead of plotting individual rides which causes visual noise, the backend maps coordinates to **H3 Indexes** (Resolution 8 or 9).
* Frontend receives an array of objects: `{ h3Index: "89283082803ffff", density: 0.84, type: "imbalance" }`
* Deck.gl or Google Maps Data Layer renders the hexagons based on these pure metrics. 

---

## 4. WebSockets & Network Architecture

### 4.1 Real-Time Workflow constraint
* **Backend:** Redis manages hot-counters. A cron spatial job calculates the `heat_score` per H3 cell every 15-30 seconds.
* **Transport:** Over WebSocket channel `admin:heatmap:sync`.
* **Payload:** Emits a sparse payload—*only cells that changed state* are sent to the client to update the Redux/Context state.
* **Frontend:** Patches the new data into the HexagonLayer. React re-renders only the changed polygons, ensuring 60FPS map performance.

### 4.2 Example Socket Payload
```json
{
  "event": "MARKET_GRID_UPDATE",
  "timestamp": 1718029381,
  "cells": [
    {
      "cellId": "8928308280bffff",
      "demand": 145,
      "supply": 12,
      "imbalanceScore": 89,
      "eta": "14 min",
      "surge": 2.1
    }
  ],
  "global": {
    "activeRequests": 1042,
    "availableDrivers": 204
  }
}
```

---

## 5. Implementation Phasing for DashDrive

**Phase 1: Visual & State Refactor (Complete)**
* Clean up consumer UI bloat.
* Establish standard zones for Demand, Supply, and Surge.

**Phase 2: Spatial Grid & H3 Implementation**
* Transition from hardcoded latitude/longitude zone polygons to mathematically defined H3 hexagons using `deck.gl` or mapbox over Google Maps.

**Phase 3: The Algorithms & Metrics Engine**
* Implement the pseudo-code equations into the backend.
* Create the bottom charts (Demand vs Supply line charts).
* Build the `ZoneRanker` to constantly push the "Top 5 Problem Zones" to the UI.

**Phase 4: Action & Dispatch Triggers**
* Wire the UI inputs (Surge Slider, Broadcast Msg) directly into the marketplace matching engine and driver notification service.
