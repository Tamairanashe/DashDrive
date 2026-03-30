import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'store-uuid-here' })
  @IsNotEmpty()
  @IsString()
  storeId: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great service and fast delivery!', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: 'customer-uuid-here', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;
}
