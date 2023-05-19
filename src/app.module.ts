import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { globalConfig } from 'config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [globalConfig],
    }),
    // MongooseModule.forRoot(process.env.MONGODB_URI, {authSource: 'admin'}),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigType<typeof globalConfig>) => ({
        uri: config.mongo.uri,
        authSource: 'admin',
      }),
      inject: [globalConfig.KEY],
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
