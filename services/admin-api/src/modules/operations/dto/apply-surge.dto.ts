// modules/operations/dto/apply-surge.dto.ts
import { IsEnum, IsNumber, IsString, Min, Max } from "class-validator";

export class ApplySurgeDto {
  @IsString()
  zoneId: string;

  @IsEnum(["ride_hailing", "food_delivery", "parcel_delivery", "city_to_city"])
  serviceType: "ride_hailing" | "food_delivery" | "parcel_delivery" | "city_to_city";

  @IsNumber()
  @Min(1)
  @Max(5)
  multiplier: number;

  @IsString()
  reason: string;

  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsString()
  triggeredBy: string;
}
