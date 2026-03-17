import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const [type, key] = authHeader.split(' ');

    if (type !== 'Bearer' || !key) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const systemApiKey = this.configService.get<string>('SYSTEM_API_KEY');

    if (key !== systemApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Mock organization for request scope
    request['organization'] = { id: 'dashdrive-logistics-engine', name: 'Logistics Engine' };
    
    return true;
  }
}
