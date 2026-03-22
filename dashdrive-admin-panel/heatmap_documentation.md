# DashDrive Admin Panel: Heatmap & Market Intensity Guide

The Heatmap (Market Intensity Hub) is a real-time spatial intelligence tool designed for logistics managers to monitor and respond to supply-demand imbalances across different service verticals.

---

## 1. Visual Intelligence Layers
The map supports multiple concurrent layers to provide a holistic view of the operational environment:

- **Market Demand (Zones)**: Circular overlays color-coded by intensity:
  - <span style="color:#22c55e">â—</span> **Low (Green)**: Stable market, supply meets demand.
  - <span style="color:#eab308">â—</span> **Medium (Yellow)**: Increasing activity.
  - <span style="color:#ef4444">â—</span> **High (Red)**: High volume, possible delays.
  - <span style="color:#a855f7">â—</span> **Critical (Purple)**: Severe under-supply; immediate action required.
- **Driver Supply**: Blue density clusters representing active asset availability.
- **Weather (Rain Clusters)**: Sky-blue polygons indicating areas of heavy rain or storms that typically spike demand.
- **Traffic (Gridlock)**: Thick red polylines showing significant road congestion and estimated delays.
- **Local Events**: Gold star markers for concerts, festivals, or holidays that drive localized demand spikes.
- **Individual Demand Points**: High-resolution "pulse" markers showing exact rider/customer request locations.

---

## 2. Market Insights (Side Panel)
Selecting a zone or service asset opens the Insight Panel, providing granular data:

- **Supply vs Demand**: Real-time count of active drivers vs. active bids/orders.
- **Avg ETA**: Predictive wait times based on current sector density.
- **Surge Strategy**: The active multiplier (e.g., 1.5x, 2.0x) applied to the zone.
- **Environmental Impact**: Percentage-based breakdowns of how weather, traffic, and events are currently affecting market friction.

---

## 3. Interactive Controls & Workflows

### Filtering & Navigation
- **Hierarchical Search**: Filter the entire hub by Country > Region > City.
- **Service vertical Toggle**: Switch between Ride Hailing, Food, Mart, Parcel, and Shopping views.
- **Temporal Analysis**: Use the Date/Time picker to view historical demand patterns or live data.
- **Drill-down**: Search for specific zones or locations directly on the map to auto-pan and zoom.

### AI Tactics Engine
The platform automatically generates tactical recommendations based on live data:
- **Example**: *"Surge high due to Heavy Congestion. Recommend $2.00 driver bonus for bypass routes."*

### Broadcast Center
Allows manual or automated intervention in the market:
- **Incentive Broadcast**: Send push notifications to drivers in nearby low-demand zones to migrate to high-demand areas by offering a temporary bonus.
- **Manual Alerts**: Send custom weather or traffic warnings to all users in a specific sector.

---

## 4. Technical Summary
- **Component**: `HeatMapPage.tsx`
- **Map Base**: Google Maps JavaScript API (via `@react-google-maps/api`).
- **Data Patterns**: Utilizes `MOCK_ZONES`, `MOCK_RAIN_CLUSTERS`, and `MOCK_DEMAND_POINTS` for high-fidelity simulation.
- **Real-time Engine**: Integrated with an AI Tactics Engine that processes environmental variables to suggest surge and incentive adjustments.
