import { SystemRoles } from "@/typing";
import { UniqueEmail, UniqueRegister } from "@/utils";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDTO {
  @IsString({
    message: "Register must be a string",
  })
  @MaxLength(10, {
    message: "Register must have a maximum of 10 characters",
  })
  @IsNotEmpty({
    message: "Register is required",
  })
  @UniqueRegister()
  register: string;

  @IsString({
    message: "Name must be a string",
  })
  @MaxLength(80, {
    message: "Name must have a maximum of 80 characters",
  })
  @MinLength(5, {
    message: "Name must have a minimum of 5 characters",
  })
  @IsNotEmpty({
    message: "Name is required",
  })
  name: string;

  @IsEmail()
  @UniqueEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;

  @IsDate({
    message: "Last connection must be a date",
  })
  @IsOptional()
  lastConnection: Date | null;

  @IsBoolean({
    message: "Is banned must be a boolean",
  })
  @IsOptional()
  isBanned: boolean;

  @IsBoolean({
    message: "Can create ticket must be a boolean",
  })
  @IsOptional()
  canCreateTicket: boolean;

  @IsBoolean({
    message: "Can resolve ticket must be a boolean",
  })
  @IsOptional()
  canResolveTicket: boolean;

  @IsString({
    message: "Role must be a string",
  })
  @IsNotEmpty({
    message: "Role is required",
  })
  role: string;

  @IsString({
    message: "Sector must be a string",
  })
  @IsNotEmpty({
    message: "Sector is required",
  })
  sector: string;

  @IsString({
    message: "System role must be a string",
  })
  @IsNotEmpty({
    message: "System role is required",
  })
  systemRole: SystemRoles;
}

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, [
    "register",
    "lastConnection",
    //   "isBanned",
    //   "canCreateTicket",
    //   "canResolveTicket",
    //   "systemRole",
  ]),
) {}
