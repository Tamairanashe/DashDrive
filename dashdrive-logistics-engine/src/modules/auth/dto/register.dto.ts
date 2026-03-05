import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { BusinessType } from '@prisma/client';

export class RegisterDto {
    @ApiProperty({ example: 'merchant@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'My Awesome Store' })
    @IsString()
    @IsNotEmpty()
    storeName: string;

    @ApiProperty({ example: 'ZW' })
    @IsString()
    @IsNotEmpty()
    countryCode: string;

    @ApiProperty({ example: 'MART', enum: BusinessType, required: false })
    @IsOptional()
    @IsEnum(BusinessType)
    type?: BusinessType;
}
