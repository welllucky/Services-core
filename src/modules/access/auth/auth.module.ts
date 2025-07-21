import { SharedSessionModule } from '@/modules/shared/session';
import { SharedUserModule } from '@/modules/shared/user';
import { UNIT_DAYS_TO_EXPIRE_THE_TOKEN } from "@/utils";
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    SharedUserModule,
    SharedSessionModule,
    PassportModule.register({
      defaultStrategy: "jwt",
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_SECRET'),
        signOptions: {
          expiresIn: `${UNIT_DAYS_TO_EXPIRE_THE_TOKEN}d`,
          algorithm: 'HS256',
          issuer: configService.get<string>('CLIENT_URL') ?? 'services',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, LocalStrategy, AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}