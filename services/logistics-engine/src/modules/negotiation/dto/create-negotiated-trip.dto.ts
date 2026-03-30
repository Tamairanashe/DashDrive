import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateNegotiatedTripDto {
  @ApiProperty({ example: 'Airport' })
  @IsNotEmpty()
  @IsString()
  pickup_location: string;

  @ApiProperty({ example: 'City Center' })
  @IsNotEmpty()
  @IsString()
  destination: string;

  @ApiProperty({ example: -17.8248 })
  @IsNotEmpty()
  @IsNumber()
  pickup_lat: number;

  @ApiProperty({ example: 31.053 })
  @IsNotEmpty()
  @IsNumber()
  pickup_lng: number;

  @ApiProperty({ example: -17.8292 })
  @IsNotEmpty()
  @IsNumber()
  dropoff_lat: number;

  @ApiProperty({ example: 31.0522 })
  @IsNotEmpty()
  @IsNumber()
  dropoff_lng: number;

  @ApiProperty({ example: 6.0 })
  @IsNotEmpty()
  @IsNumber()
  rider_bid: number;

  @ApiProperty({ enum: ['RIDE', 'PARCEL'], example: 'RIDE' })
  @IsEnum(['RIDE', 'PARCEL'])
  vertical: 'RIDE' | 'PARCEL';

  @ApiProperty({ example: 'ZW' })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: 'customer-uuid-here' })
  @IsOptional()
  @IsUUID()
  customerId?: string;
}
