import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyAuthGuard } from '../../modules/auth/api-key-auth.guard';

@Injectable()
export class SystemAuthGuard implements CanActivate {
  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtGuard = this.moduleRef.get(JwtAuthGuard, { strict: false });
    const apiKeyGuard = this.moduleRef.get(ApiKeyAuthGuard, { strict: false });

    // Try JWT first
    try {
      const jwtResult = await jwtGuard.canActivate(context);
      if (jwtResult) return true;
    } catch (e) {
      // Ignore and try API Key
    }

    // Try API Key
    try {
      const apiKeyResult = await apiKeyGuard.canActivate(context);
      if (apiKeyResult) return true;
    } catch (e) {
      // Both failed
    }

    return false;
  }
}
