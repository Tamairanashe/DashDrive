import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'store-uuid-here' })
  @IsNotEmpty()
  @IsUUID()
  storeId: string;

  @ApiProperty({ example: 'Beverages' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
