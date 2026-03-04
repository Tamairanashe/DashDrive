import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
}
