import { IsNumber, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateLocalRideRequestDto {
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  dropoffAddress: string;

  @IsNumber()
  pickupLat: number;

  @IsNumber()
  pickupLng: number;

  @IsNumber()
  dropoffLat: number;

  @IsNumber()
  dropoffLng: number;

  @IsNumber()
  @Min(0.5)
  proposedPrice: number;

  @IsNumber()
  @IsOptional()
  passengerCount?: number;
}

export class CreateLocalOfferDto {
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsNumber()
  @Min(0.5)
  offerPrice: number;

  @IsNumber()
  @IsOptional()
  etaMinutes?: number;
}

export class DriverLocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
