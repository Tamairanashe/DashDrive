import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateRideDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  serviceTypeId: string;

  @IsNumber()
  pickupLat: number;

  @IsNumber()
  pickupLng: number;

  @IsString()
  pickupAddress: string;

  @IsNumber()
  dropoffLat: number;

  @IsNumber()
  dropoffLng: number;

  @IsString()
  dropoffAddress: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;
}
