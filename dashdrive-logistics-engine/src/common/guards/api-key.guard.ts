import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const internalApiKey = process.env.INTERNAL_API_KEY || 'dashdrive_secret_key_2026';
    if (apiKey === internalApiKey) {
      request.isInternal = true;
      return true;
    }

    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: apiKey as string },
      include: { merchant: true }
    });

    if (!keyRecord || !keyRecord.isActive) {
      throw new UnauthorizedException('Invalid or inactive API Key');
    }

    // Update last used at
    await this.prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() }
    });

    // Attach merchant info to the request for service consumption
    request.merchant = keyRecord.merchant;
    return true;
  }
}
