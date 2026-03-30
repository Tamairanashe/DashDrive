import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessType } from '@prisma/client';

export class CreateMerchantDto {
  @ApiProperty({ example: 'Johns Grocery' })
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @ApiProperty({ example: 'merchant@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'ZW', description: 'Two-letter country code' })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: 'MART', enum: BusinessType, required: false })
  @IsOptional()
  @IsEnum(BusinessType)
  type?: BusinessType;
}
