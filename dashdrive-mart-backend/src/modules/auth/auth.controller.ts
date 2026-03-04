import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate merchant and get access token' })
    @ApiResponse({ status: 200, description: 'Return access token' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new merchant' })
    @ApiResponse({ status: 201, description: 'Merchant successfully registered' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
