// modules/operations/dto/broadcast-incentive.dto.ts
import { IsNumber, IsString, Min } from "class-validator";

export class BroadcastIncentiveDto {
  @IsString()
  zoneId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  @Min(1)
  targetCount: number;

  @IsString()
  message: string;

  @IsString()
  triggeredBy: string;
}
