import { RequestContext } from '@medibloc/nestjs-request-context';
// import { AuthUserRole } from '../modules/auth/@types';
// import { AuthUserEntity } from '../modules/auth/entities';

export class AppRequestContext extends RequestContext {
    user: any;
//   authUser: AuthUserEntity;
//   rolesMap: Partial<Record<AuthUserRole, boolean>>;

}
