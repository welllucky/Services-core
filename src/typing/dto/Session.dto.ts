import { PickType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsDate,
  IsJWT,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { CreateUserDTO } from "./User.dto";

export class GetSessionDTO extends PickType(CreateUserDTO, [
  "email",
  "password",
]) {}

export class SessionDTO {
  @IsJWT({
    message: "Token must be a valid JWT",
  })
  token: string;

  @IsDate({
    message: "ExpiresAt must be a valid Date",
  })
  expiresAt: Date;

  @IsBoolean({
    message: "IsActive must be a boolean",
  })
  isActive: boolean;

  @IsString({
    message: "UserId must be a string",
  })
  @IsNotEmpty({
    message: "UserId is required",
  })
  userId: string;
}

export class SessionInfoDTO extends PickType(SessionDTO, [
  "token",
  "expiresAt",
]) {}
