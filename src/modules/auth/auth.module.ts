import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { globalConfig } from "config";
import { JwtStrategy } from "./guards/jwt.strategy";
import { MixedAuthGuard } from "./guards/mixed-auth.guard";
import { RoleAuthGuard } from "./guards/role-auth.guard";
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [globalConfig.KEY],
      useFactory: async (cfg: ConfigType<typeof globalConfig>) => {
        return {
          secret: cfg.jwt.secret,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    

    RoleAuthGuard,
    MixedAuthGuard,
    // strategy
    JwtStrategy,
  ],
  exports: [

    RoleAuthGuard,
    MixedAuthGuard,


    // strategy
    JwtStrategy,
  ],
})
export class AuthModule {}
