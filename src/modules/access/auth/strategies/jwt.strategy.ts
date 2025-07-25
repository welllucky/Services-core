import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser, Roles } from '@/typing';

export interface JwtPayload {
  sub: string;
  register: string;
  name: string;
  email: string;
  position: string;
  sector: string;
  role: Roles;
  isBanned: boolean;
  canCreateTicket: boolean;
  canResolveTicket: boolean;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secretKey = configService.get<string>('AUTH_SECRET');
    if (!secretKey) {
      throw new Error('AUTH_SECRET is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    return {
      register: payload.register,
      name: payload.name,
      email: payload.email,
      isBanned: payload.isBanned,
      canCreateTicket: payload.canCreateTicket,
      canResolveTicket: payload.canResolveTicket,
      position: payload.position,
      sector: payload.sector,
      role: payload.role,
    };
  }
}