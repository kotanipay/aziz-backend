import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface GlobalConfig {
  appEnv: 'dev' | 'stg' | 'prod';
  jwt: {
    secret: string;
  };
  refreshToken: {
    expiresIn: number;
  };
  accessToken: {
    expiresIn: number;
  };
  firebase: {
    cert: Record<string, any>;
  };
  s3: {
    accessKey: string;
    secretKey: string;
    endpoint: string;
    bucket: string;
  };
  mongo: {
    uri: string;
  }
}

const GlobalConfigSchema = Joi.object<GlobalConfig>({
  appEnv: Joi.string().valid('dev', 'stg', 'prod').required(),

  jwt: Joi.object<GlobalConfig['jwt']>({
    secret: Joi.string().required(),
  }),
  firebase: Joi.object<GlobalConfig['firebase']>({
    cert: Joi.object().required(),
  }),
  s3: Joi.object<GlobalConfig['s3']>({
    accessKey: Joi.string().required(),
    secretKey: Joi.string().required(),
    bucket: Joi.string().required(),
  }),
  mongo: Joi.object<GlobalConfig['mongo']>({
    uri: Joi.string().required(),
  }),
});

export const globalConfig = registerAs('global', () => {
  const cfg = {
    appEnv: process.env.APP_ENV,
    jwt: {
      secret: 'supersecret',
    },
    refreshToken: {
      expiresIn: 3600 * 24 * 30, // 1 month
    },
    accessToken: {
      expiresIn: 3600 / 4, // 15 mins
    },
    firebase: {
      cert: process.env.KOTANIPAY_FB_CERT
        ? JSON.parse(Buffer.from(process.env.KOTANIPAY_FB_CERT, 'base64').toString('utf-8'))
        : null,
    },
    s3: {
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_BUCKET_NAME,
    },
    mongo: {
      uri: process.env.MONGODB_URI,
    },

  } as GlobalConfig;



  if (!cfg.appEnv) {
    cfg.appEnv = 'dev';
  }

  if (cfg.appEnv === 'dev') {
    cfg.accessToken.expiresIn = 3600 * 10000; // 10k hours
  }

  // Validate
  const result = GlobalConfigSchema.validate(cfg, {
    allowUnknown: true,
    abortEarly: false,
  });
  if (result.error) {
    console.error('GlobalConfig Validation errors:');
    for (const v of result.error.details) {
      console.error(v.message);
    }
    throw new Error('Missing configuration options');
  }
  return cfg;
});


