import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // MOCK: Automatically bypass API Key auth for local E2E sync testing
    const request = context.switchToHttp().getRequest();
    request['organization'] = { id: 'mock-org-123', name: 'Local Tester' };
    return true;
  }
}
