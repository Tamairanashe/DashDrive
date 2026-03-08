import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsUUID, IsBoolean, IsObject } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'store-uuid-here' })
    @IsNotEmpty()
    @IsUUID()
    storeId: string;

    @ApiProperty({ example: 'Milk 1L' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Fresh whole milk', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 2.50 })
    @IsNotEmpty()
    @IsNumber()
    basePrice: number;

    @ApiProperty({ example: 100 })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    images?: string[];

    @ApiProperty({ example: 'category-uuid-here', required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ example: '123456789', required: false })
    @IsOptional()
    @IsString()
    barcode?: string;

    @ApiProperty({ example: 'kg', required: false })
    @IsOptional()
    @IsString()
    weightUnit?: string;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    isHalal?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    isVegan?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    isVegetarian?: boolean;

    @ApiProperty({ example: { color: 'red', size: 'L' }, required: false })
    @IsOptional()
    @IsObject()
    attributes?: any;
}
