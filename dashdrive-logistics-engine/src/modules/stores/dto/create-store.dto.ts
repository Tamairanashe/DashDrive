import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

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

    @ApiProperty({ example: 0.15, required: false })
    @IsOptional()
    @IsNumber()
    taxRate?: number;
}
