import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class SubmitOfferDto {
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsNumber()
  offerPrice: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
