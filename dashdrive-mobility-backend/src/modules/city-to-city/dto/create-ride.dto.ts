import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, MIN, Max } from 'class-validator';

export class CreateCityRideDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsDateString()
  @IsNotEmpty()
  departureTime: string;

  @IsNumber()
  passengerCount: number;

  @IsNumber()
  proposedPrice: number;

  @IsString()
  @IsOptional()
  luggageType?: string;
}
