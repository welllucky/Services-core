import { Roles } from "@/typing";
import { UniqueEmail, UniqueRegister } from "@/utils/decorators";
import { PartialType, PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength
} from "class-validator";

export class UserDTO {
    @ApiProperty({
        description: "User register/ID",
        type: "string",
        example: "123456",
    })
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
    register!: string;

    @ApiProperty({
        description: "User name",
        type: "string",
        example: "John Doe",
    })
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
    name!: string;

    @ApiProperty({
        description: "User email",
        type: "string",
        example: "john.doe@example.com",
    })
    @IsEmail()
    @UniqueEmail()
    email!: string;

    @ApiProperty({
        description: "User position",
        type: "string",
        example: "Senior Developer",
    })
    @IsString({
        message: "Position must be a string",
    })
    @IsNotEmpty({
        message: "Position is required",
    })
    position!: string;

    @ApiProperty({
        description: "User sector",
        type: "string",
        example: "IT",
    })
    @IsString({
        message: "Sector must be a string",
    })
    @IsNotEmpty({
        message: "Sector is required",
    })
    sector!: string;
}

export class CreateUserDTO extends UserDTO {
    @ApiProperty({
        description: "User password",
        type: "string",
        example: "password123",
    })
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
        minLowercase: 1,
    })
    password!: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class UserPublicDTO extends PickType(UserDTO, [
    "name",
    "email",
    "position",
    "sector",
    "register",
]) {
    constructor(
        readonly name: string,
        readonly email: string,
        readonly position: string,
        readonly sector: string,
        readonly register: string,
    ) {
        super();
    }

    @IsString()
    @IsNotEmpty()
    role!: Roles;

    @IsBoolean()
    @IsNotEmpty()
    isBanned!: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canCreateTicket!: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canResolveTicket!: boolean;
}

export class UserRestrictDTO extends PickType(UserPublicDTO, [
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
        readonly canCreateTicket: boolean,
        readonly canResolveTicket: boolean,
        readonly isBanned: boolean,
        readonly role: Roles,
        readonly register: string,
    ) {
        super();
    }
}
