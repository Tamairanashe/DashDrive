import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateDriverTripDto {
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsDateString()
  @IsNotEmpty()
  departureTime: string;

  @IsNumber()
  pricePerSeat: number;

  @IsNumber()
  totalSeats: number;
}
