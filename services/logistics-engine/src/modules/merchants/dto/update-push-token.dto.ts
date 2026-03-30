import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePushTokenDto {
  @ApiProperty({ example: 'fcm_token_123456' })
  @IsString()
  @IsNotEmpty()
  pushToken: string;
}
