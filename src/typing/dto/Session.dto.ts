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

export class GetSessionDTO extends PickType(CreateUserDTO, ["password"]) {
    @IsEmail({}, { message: "Email must be a valid email" })
    email: string;
}

export class SessionDTO {
    @IsString({
        message: "Id must be a string",
    })
    id: string;

    @IsJWT({
        message: "Token must be a valid JWT",
    })
    token: string;

    @IsDate({
        message: "ExpiresAt must be a valid Date",
    })
    expiresAt: Date;

    @IsDate({
        message: "CreatedAt must be a valid Date",
    })
    createdAt: Date;

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
