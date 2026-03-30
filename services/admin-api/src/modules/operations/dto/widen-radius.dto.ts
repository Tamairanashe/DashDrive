// modules/operations/dto/widen-radius.dto.ts
import { IsNumber, IsString, Min } from "class-validator";

export class WidenRadiusDto {
  @IsString()
  zoneId: string;

  @IsNumber()
  @Min(500)
  radiusMeters: number;

  @IsString()
  reason: string;

  @IsString()
  triggeredBy: string;
}
