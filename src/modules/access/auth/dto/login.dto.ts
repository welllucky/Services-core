import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}

export class LoginResponseDto {
  accessToken!: string;
  expiresAt!: Date;
}

export class ProfileResponseDto {
  register!: string;
  name!: string;
  email!: string;
  position!: string;
  sector!: string;
  role!: string;
  isBanned!: boolean;
  canCreateTicket!: boolean;
  canResolveTicket!: boolean;
}