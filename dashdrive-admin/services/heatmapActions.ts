// services/heatmapActions.ts

export type ApplySurgePayload = {
  zoneId: string;
  serviceType: "ride_hailing" | "food_delivery" | "parcel_delivery" | "city_to_city";
  multiplier: number; // e.g. 1.2, 1.5, 2.0
  reason: string;
  durationMinutes: number;
  triggeredBy: string; // admin user id
};

export type WidenRadiusPayload = {
  zoneId: string;
  radiusMeters: number;
  reason: string;
  triggeredBy: string;
};

export type BroadcastIncentivePayload = {
  zoneId: string;
  amount: number;
  targetCount: number;
  message: string;
  triggeredBy: string;
};

export async function applySurge(payload: ApplySurgePayload) {
  const response = await fetch("/api/admin/operations/surge/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to apply surge");
  }

  return response.json();
}

export async function widenRadius(payload: WidenRadiusPayload) {
  const response = await fetch("/api/admin/operations/radius/widen", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to widen radius");
  }

  return response.json();
}

export async function broadcastIncentive(payload: BroadcastIncentivePayload) {
  const response = await fetch("/api/admin/operations/incentives/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to broadcast incentive");
  }

  return response.json();
}

export type NotifyFleetPayload = {
  zoneId: string;
  serviceType: "ride_hailing" | "food_delivery" | "parcel_delivery" | "city_to_city";
  target: "drivers" | "fleet_operators" | "couriers";
  title: string;
  message: string;
  priority: "low" | "normal" | "high" | "critical";
  sendPush?: boolean;
  sendSMS?: boolean;
  sendEmail?: boolean;
  triggeredBy: string;
};

export async function notifyFleet(payload: NotifyFleetPayload) {
  const response = await fetch("/api/admin/operations/notifications/fleet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to notify fleet");
  }

  return response.json();
}
