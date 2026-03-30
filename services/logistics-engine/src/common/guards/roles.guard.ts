import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Assuming user payload has a role property (e.g. from JWT)
    if (
      !user ||
      (!roles.includes(user.role) && !roles.includes(user.role?.toLowerCase()))
    ) {
      return false;
    }
    return true;
  }
}
