import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
}
