# Heatmap & Market Intelligence System

The Heatmap is the core tactical visualization for DashDrive's marketplace operations. It provides real-time demand forecasting, asset tracking, and automated surge management.

## 🗺️ Visual Architecture
The heatmap is built using the **Google Maps JavaScript API** with the following layers:

- **Demand Heatmap**: Color-coded circular zones indicating demand intensity (Green: Low, Red: High, Purple: Critical).
- **Live Asset Markers**: Real-time positions of drivers and couriers, with status-dependent icons.
- **Traffic Layer**: Integrated Google Maps traffic data for evaluating congestion and route delays.
- **Weather Clusters**: Visual polygons representing adverse weather conditions (Rain, Storms) derived from live alerts.
- **Scheduled Event Markers**: Historical and future high-impact events (Concerts, Sports) that trigger demand spikes.

## 📡 Data Flow & Live-Readiness
The system operates on a dual-sync architecture:

1.  **Initial Snapshot**: On page load, `loadMarketData()` fetches the current state from `analyticsApi.getDemandIntensity` and `adminApi.events.list`.
2.  **WebSocket Streams**: Subscribed to the platform event bus for:
    - `MARKET_DEMAND_SHIFT`: Updates zone intensity and driver counts instantly.
    - `SURGE_EVALUATION_COMPLETED`: Triggers AI surge recommendations on the map.
3.  **Fail-Safe Redundancy**: If APIs are unreachable, the system falls back to high-fidelity mock data via `getMockZonesForService`, keeping the dashboard functional for demo and training.

## 🛠️ Operational Controls
- **Targeting Zones**: Clicking a zone opens the **Zone Insight Drawer**, providing granular metrics (Avg Wait Time, Driver Efficiency).
- **Surge Deployment**: Manual or AI-assisted surge multiplier application.
- **Incentive Broadcast**: Mass messaging system to notify nearby drivers of high-demand opportunities.
- **Peak Configuration**: A weekly scheduling engine for recurring high-volume windows.

## 🔧 Technical Components
- **`HeatMapPage.tsx`**: Main container and state orchestrator.
- **`HeatMapCanvas.tsx`**: Pure functional component for rendering map layers and markers.
- **`mapsApi.ts`**: Translation layer for Google Maps Places (New) and Routes APIs.
- **`useWeather.ts`**: Custom hook for real-time weather integration.

---
*Created: March 2026 | Part of the DashDrive Admin Portal.*
