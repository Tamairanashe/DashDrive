// modules/operations/operations.service.ts
import { Injectable } from "@nestjs/common";
import { ApplySurgeDto } from "./dto/apply-surge.dto";
import { NotifyFleetDto } from "./dto/notify-fleet.dto";
import { WidenRadiusDto } from "./dto/widen-radius.dto";
import { BroadcastIncentiveDto } from "./dto/broadcast-incentive.dto";
import { HeatMapFilterDto } from "./dto/heatmap-filter.dto";

@Injectable()
export class OperationsService {
  async applySurge(dto: ApplySurgeDto) {
    // Audit log
    console.log(`[OperationsService] Applying surge: ${dto.multiplier}x for ${dto.serviceType} in ${dto.zoneId}`);

    // Simulation of persistence and engine trigger
    const surgeRule = {
      id: `surge_${Date.now()}`,
      ...dto,
      status: "active",
      createdAt: new Date(),
    };

    // Return success response
    return {
      success: true,
      message: `Surge of ${dto.multiplier}x applied successfully to ${dto.zoneId}`,
      data: surgeRule,
    };
  }

  async notifyFleet(dto: NotifyFleetDto) {
    // Audit log
    console.log(`[OperationsService] Notifying ${dto.target} in ${dto.zoneId}: ${dto.title}`);

    // Simulation of notification delivery
    const notificationResult = {
      id: `ntf_${Date.now()}`,
      ...dto,
      recipientsCount: Math.floor(Math.random() * 200) + 50,
      timestamp: new Date(),
    };

    return {
      success: true,
      message: `${notificationResult.recipientsCount} ${dto.target} notified successfully`,
      data: notificationResult,
    };
  }

  async widenRadius(dto: WidenRadiusDto) {
    console.log(`[OperationsService] Widening radius for ${dto.zoneId} to ${dto.radiusMeters}m`);
    
    return {
      success: true,
      message: `Dispatch radius widened to ${dto.radiusMeters}m for ${dto.zoneId}`,
      data: {
        id: `rad_${Date.now()}`,
        ...dto,
        timestamp: new Date(),
      },
    };
  }

  async broadcastIncentive(dto: BroadcastIncentiveDto) {
    console.log(`[OperationsService] Broadcasting incentive for ${dto.zoneId}: $${dto.amount}`);
    
    return {
      success: true,
      message: `Incentive of $${dto.amount} broadcast to ${dto.targetCount} partners in ${dto.zoneId}`,
      data: {
        id: `inc_${Date.now()}`,
        ...dto,
        timestamp: new Date(),
      },
    };
  }

  async getHeatMapData(filters: HeatMapFilterDto) {
    console.log("[OperationsService] Fetching HeatMap data with filters:", filters);

    // Mock Base Zones (Synced with Frontend for demo consistency)
    const baseZones = [
      { id: "cbd", name: "CBD", lat: -17.8292, lng: 31.0522, demand: 450, supply: 120, eta: 8, cancelRate: 4.2, revenue: 5400 },
      { id: "borrowdale", name: "Borrowdale", lat: -17.7632, lng: 31.0854, demand: 250, supply: 80, eta: 6, cancelRate: 2.5, revenue: 3200 },
      { id: "avondale", name: "Avondale", lat: -17.7928, lng: 31.0289, demand: 180, supply: 45, eta: 9, cancelRate: 5.1, revenue: 2100 },
      { id: "mbare", name: "Mbare", lat: -17.8541, lng: 31.0403, demand: 320, supply: 15, eta: 14, cancelRate: 11.2, revenue: 1500 },
      { id: "airport", name: "Airport", lat: -17.9318, lng: 31.0928, demand: 120, supply: 30, eta: 7, cancelRate: 2.1, revenue: 4200 },
    ];

    let filteredZones = [...baseZones];

    // 1. Filter by City/Service (Mock logic)
    if (filters.city && filters.city !== "all") {
      // In a real app, this would query a specific spatial database
    }

    // 2. Handle Search Intents & Keywords
    if (filters.search) {
      const search = filters.search.toLowerCase();

      // Operational Search Intents
      if (search.includes("high demand") || search.includes("most demand")) {
        filteredZones.sort((a, b) => b.demand - a.demand);
      } else if (search.includes("low supply") || search.includes("shortage")) {
        filteredZones.sort((a, b) => a.supply - b.supply);
      } else if (search.includes("high eta")) {
        filteredZones.sort((a, b) => b.eta - a.eta);
      } else if (search.includes("cancel")) {
        filteredZones.sort((a, b) => b.cancelRate - a.cancelRate);
      } else if (search.includes("revenue")) {
        filteredZones.sort((a, b) => b.revenue - a.revenue);
      } else {
        // Direct Zone Name Lookup
        filteredZones = filteredZones.filter(z => 
          z.name.toLowerCase().includes(search)
        );
      }
    }

    // 3. Temporal Simulation (Adjust values based on date range)
    if (filters.dateRange && filters.dateRange !== "realtime") {
        filteredZones = filteredZones.map(z => ({
            ...z,
            demand: Math.round(z.demand * (filters.dateRange === "yesterday" ? 0.8 : 1.2)),
            supply: Math.round(z.supply * 1.1),
        }));
    }

    return {
      success: true,
      timestamp: new Date(),
      data: {
        zones: filteredZones,
        summary: {
          count: filteredZones.length,
          totalDemand: filteredZones.reduce((sum, z) => sum + z.demand, 0),
          totalSupply: filteredZones.reduce((sum, z) => sum + z.supply, 0),
          avgEta: filteredZones.length > 0 
            ? Math.round((filteredZones.reduce((sum, z) => sum + z.eta, 0) / filteredZones.length) * 10) / 10 
            : 0,
        }
      }
    };
  }
}
