import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid API Key format. Use Bearer <key>',
      );
    }

    const token = authHeader.split(' ')[1];

    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key: token, isActive: true },
      include: { merchant: true },
    });

    if (!apiKey || !apiKey.merchant) {
      throw new UnauthorizedException('Invalid or inactive API Key');
    }

    // Attach merchant to request so controllers can use req.merchant
    request.merchant = apiKey.merchant;
    request.apiKey = apiKey;

    // Update last used asynchronously
    this.prisma.apiKey
      .update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {});

    return true;
  }
}
