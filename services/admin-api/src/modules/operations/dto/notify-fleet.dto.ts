// modules/operations/dto/notify-fleet.dto.ts
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class NotifyFleetDto {
  @IsString()
  zoneId: string;

  @IsEnum(["ride_hailing", "food_delivery", "parcel_delivery", "city_to_city"])
  serviceType: "ride_hailing" | "food_delivery" | "parcel_delivery" | "city_to_city";

  @IsEnum(["drivers", "fleet_operators", "couriers"])
  target: "drivers" | "fleet_operators" | "couriers";

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(["low", "normal", "high", "critical"])
  priority: "low" | "normal" | "high" | "critical";

  @IsOptional()
  @IsBoolean()
  sendPush?: boolean;

  @IsOptional()
  @IsBoolean()
  sendSMS?: boolean;

  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;

  @IsString()
  triggeredBy: string;
}
