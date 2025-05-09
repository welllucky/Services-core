import { Roles } from "@/typing";
import { UniqueEmail, UniqueRegister } from "@/utils/decorators";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
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

export class UserDTO {
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

  @IsString()
  hash: string;

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
  position: string;

  @IsString({
    message: "Sector must be a string",
  })
  @IsNotEmpty({
    message: "Sector is required",
  })
  sector: string;

  @IsString({
    message: "System position must be a string",
  })
  @IsNotEmpty({
    message: "System position is required",
  })
  role: Roles;
}

export class CreateUserDTO extends OmitType(UserDTO, [
  "isBanned",
  "canCreateTicket",
  "lastConnection",
  "canResolveTicket",
  "hash",
  "role",
]) {}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class UserPublicDTO extends PickType(UserDTO, [
  "name",
  "email",
  "position",
  "sector",
  "canCreateTicket",
  "canResolveTicket",
  "isBanned",
  "register",
]) {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly position: string,
    readonly sector: string,
    readonly canCreateTicket: boolean,
    readonly canResolveTicket: boolean,
    readonly isBanned: boolean,
    readonly role: Roles,
    readonly register: string,
  ) {
    super();
  }
}

export class UserRestrictDTO extends PickType(UserDTO, [
  "name",
  "email",
  "position",
  "sector",
  "isBanned",
  "canCreateTicket",
  "canResolveTicket",
  "role",
  "register",
]) {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly position: string,
    readonly sector: string,
    readonly isBanned: boolean,
    readonly canCreateTicket: boolean,
    readonly canResolveTicket: boolean,
    readonly role: Roles,
    readonly register: string,
  ) {
    super();
  }
}
