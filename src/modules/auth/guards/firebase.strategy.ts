import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import express from 'express';
import * as admin from 'firebase-admin';
import { ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { Strategy } from 'passport-strategy';

import DecodedIdToken = admin.auth.DecodedIdToken;
import { globalConfig, GlobalConfig } from 'config';


// Inspired by https://github.com/tfarras/nestjs-firebase-auth/blob/master/src/passport-firebase.strategy.ts
class FirebaseAuthStrategy extends Strategy {
  readonly name = 'firebase';
  protected readonly logger = new Logger('FirebaseStrategy');
  private readonly extractor: JwtFromRequestFunction;

  constructor(
    private opts?: {
      extractor: JwtFromRequestFunction;
    },
  ) {
    super();
    if (!opts.extractor) {
      throw new Error(
        '\n Extractor is not a function. You should provide an extractor. \n Read the docs: https://github.com/tfarras/nestjs-firebase-auth#readme',
      );
    }
    this.extractor = this.opts.extractor;
  }

  async validate(idToken: DecodedIdToken): Promise<any> {
    throw new Error('Not Implemented');
  }

  async authenticate(req: express.Request): Promise<void> {
    const idToken = this.extractor(req);
    // this.logger.warn(idToken);

    if (!idToken) {
      return;
    }

    try {
      await admin
        .auth()
        .verifyIdToken(idToken, false)
        .then((res) => this.validateDecodedIdToken(res))
        .catch((err) => {
          this.logger.debug(err);
        });
    } catch (e) {
      this.logger.debug(e);
    }
  }

  private async validateDecodedIdToken(decodedIdToken: DecodedIdToken) {
    const result = await this.validate(decodedIdToken);

    if (result) {
      return true;
    }

    return false;
  }
}

@Injectable()
export class FirebaseStrategy extends PassportStrategy(FirebaseAuthStrategy, 'firebase') {
  constructor(@Inject(globalConfig.KEY) cfg: GlobalConfig) {
    super({
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: DecodedIdToken) {
    // Only block if sign in provider is password
    // if (token.firebase.sign_in_provider === 'password' && !token.email_verified) {
    //   return false;
    // }
    // const firebaseId = token.sub;
    // let identity = await this.em.findOne(FirebaseIdentityEntity, {
    //   where: { id: firebaseId },
    //   join: { alias: 'i', innerJoinAndSelect: { user: 'i.user' } },
    // });

    // // First user creation if not existing on our end
    // if (!identity) {
    //   this.logger.debug(`Creating new user from firebase id ${firebaseId}`);
    //   identity = new FirebaseIdentityEntity();
    //   identity.id = firebaseId;
    //   identity.primaryEmail = token.email;
    //   const authUser = new AuthUserEntity();
    //   authUser.role = AuthUserRole.user;
    //   identity.user = authUser;
    //   const user = new UserEntity();
    //   authUser.user = user;

    //   await this.em.save([authUser, identity, user]);

    //   return authUser;
    // } else {
    //   return identity.user;
    // }
  }
}
