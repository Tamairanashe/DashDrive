import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
    @ApiProperty({ example: 'product-uuid-here' })
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty({ example: 2.50 })
    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;
}

export class CreateOrderDto {
    @ApiProperty({ example: 'store-uuid-here' })
    @IsNotEmpty()
    @IsUUID()
    storeId: string;

    @ApiProperty({ example: 5.00 })
    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

    @ApiProperty({ type: [CreateOrderItemDto] })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
