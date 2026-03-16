import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CounterOfferDto {
  @ApiProperty({ example: 'offer-uuid-here' })
  @IsNotEmpty()
  @IsUUID()
  offerId: string;

  @ApiProperty({ example: 7.5 })
  @IsNotEmpty()
  @IsNumber()
  bidAmount: number;
}
