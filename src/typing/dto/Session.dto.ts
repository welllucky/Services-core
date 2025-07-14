import { PickType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { CreateUserDTO } from "./User.dto";
import { ApiProperty } from "@nestjs/swagger";

export class GetSessionDTO extends PickType(CreateUserDTO, ["password"]) {
  @IsEmail({}, { message: "Email must be a valid email" })
  email!: string;
}

export class SessionDTO {
  @IsString({
    message: "Id must be a string",
  })
  @ApiProperty({
    description: "Session ID",
    type: "string",
    example: "123456",
  })
  id!: string;

  @IsJWT({
    message: "Token must be a valid JWT",
  })
  @ApiProperty({
    description: "Session token",
    type: "string",
    example: "123456",
  })
  token!: string;

  @IsDate({
    message: "ExpiresAt must be a valid Date",
  })
  @ApiProperty({
    description: "Session expires at",
    type: "string",
    example: "2022-01-01T00:00:00.000Z",
  })
  expiresAt!: Date;

  @IsDate({
    message: "CreatedAt must be a valid Date",
  })
  @ApiProperty({
    description: "Session created at",
    type: "string",
    example: "2022-01-01T00:00:00.000Z",
  })
  createdAt!: Date;

  @IsBoolean({
    message: "IsActive must be a boolean",
  })
  @ApiProperty({
    description: "Session is active",
    type: "boolean",
    example: true,
  })
  isActive!: boolean;

  @IsString({
    message: "UserId must be a string",
  })
  @IsNotEmpty({
    message: "UserId is required",
  })
  @ApiProperty({
    description: "Session user ID",
    type: "string",
    example: "123456",
  })
  userId!: string;
}

export class AccessTokenDTO extends PickType(SessionDTO, ["token"]) {}

export class SessionCredentialDTO extends PickType(SessionDTO, [
  "token",
  "expiresAt",
]) {}

export class SessionInfoDto extends PickType(SessionDTO, [
  "expiresAt",
  "isActive",
  "createdAt",
  "id",
]) {
  constructor(
    readonly id: string,
    readonly expiresAt: Date,
    readonly createdAt: Date,
    readonly isActive: boolean,
  ) {
    super();
  }
}
