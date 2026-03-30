import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';

export class CreateDirectDeliveryDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsNumber()
  @IsOptional()
  packageValue?: number;

  @IsString()
  @IsOptional()
  packageDescription?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
