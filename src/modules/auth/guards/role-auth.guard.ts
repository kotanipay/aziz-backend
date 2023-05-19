import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { getAppContextALS } from 'src/modules/utils/context';
import { AppRequestContext } from 'src/modules/utils/app-request.context';
// import { AuthUserRole } from '../entities/auth-user.roles';
// import { getAppContext } from '../../../../utils/context';

export const RoleAuth = (...roles: any[]) => SetMetadata('allowedRoles', roles);

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.get<any[]>('allowedRoles', context.getHandler());
    if (!allowedRoles) {
      return true;
    }
    const ctx = getAppContextALS<AppRequestContext>();
    return allowedRoles.includes(ctx.user.role);
  }
}


