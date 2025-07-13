import { UserModule } from '@/modules/core/user';
import { SessionModule } from '@/modules/shared';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    SessionModule,
    PassportModule.register({
      defaultStrategy: "jwt",
      session: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_SECRET'),
        signOptions: {
          expiresIn: '3d',
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