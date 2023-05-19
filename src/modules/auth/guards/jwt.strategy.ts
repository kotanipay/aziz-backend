import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { GlobalConfig, globalConfig } from '../../../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(globalConfig.KEY) cfg: GlobalConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.jwt.secret,
    });
  }

  async validate(payload: any) {
    // console.log('Validate');
    // const userId = payload.sub;
    // const user = this.repository.findOne(userId);
    // if (!user) {
    //   return false;
    // }
    // return user;
    return payload;
  }
}
