import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':provider/connect')
  async connect(@Param('provider') provider: string, @Body() body: any) {
    const { merchantId, accessToken, webhookSecret, ...rest } = body;
    return this.authService.registerConnection(merchantId, provider, { accessToken, webhookSecret, ...rest });
  }
}
