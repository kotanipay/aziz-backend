import {  ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppRequestContext } from 'src/modules/utils/app-request.context';
import { getAppContextALS } from 'src/modules/utils/context';



@Injectable()
export class MixedAuthGuard extends AuthGuard(['firebase', 'jwt']) {
  getRequest(context: ExecutionContext) {
    const type = context.getType();
    if (type !== 'http') {
      throw new Error('Unsupported execution type');
    }
    const ctx = context.switchToHttp();
    return ctx.getRequest();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res = (await super.canActivate(context)) as boolean; // AuthGuard returns a Promise only
    const req = this.getRequest(context);
    const ctx = getAppContextALS<AppRequestContext>();
    ctx.user = req.user;
    return res;
  }
}


