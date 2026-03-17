import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Johns Store Harare' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Samora Machel Ave' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Harare' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'USD' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: 'Africa/Harare' })
  @IsNotEmpty()
  @IsString()
  timezone: string;

  @ApiProperty({ example: -17.8248 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 31.053 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 0.15, required: false })
  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsNumber()
  estimatedPrepTime?: number;

  @ApiProperty({ example: ['Zambian', 'Italian'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes?: string[];

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPromoted?: boolean;
}
