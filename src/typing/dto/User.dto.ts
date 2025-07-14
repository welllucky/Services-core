import { Roles } from "@/typing";
import { UniqueEmail, UniqueRegister } from "@/utils/decorators";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
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

    @ApiProperty({
        description: "User hash",
        type: "string",
        example: "hash123",
    })
    @IsString()
    hash!: string;

    @ApiProperty({
        description: "User last connection",
        type: "string",
        example: "2022-01-01T00:00:00.000Z",
    })
    @IsDate({
        message: "Last connection must be a date",
    })
    @IsOptional()
    lastConnection?: Date | null;

    @ApiProperty({
        description: "User is banned",
        type: "boolean",
        example: false,
    })
    @IsBoolean({
        message: "Is banned must be a boolean",
    })
    @IsOptional()
    isBanned!: boolean;

    @ApiProperty({
        description: "User can create ticket",
        type: "boolean",
        example: true,
    })
    @IsBoolean({
        message: "Can create ticket must be a boolean",
    })
    @IsOptional()
    canCreateTicket!: boolean;

    @ApiProperty({
        description: "User can resolve ticket",
        type: "boolean",
        example: true,
    })
    @IsBoolean({
        message: "Can resolve ticket must be a boolean",
    })
    @IsOptional()
    canResolveTicket!: boolean;

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

    @ApiProperty({
        description: "User system role",
        type: "string",
        example: "admin",
    })
    @IsString({
        message: "System role must be a string",
    })
    @IsNotEmpty({
        message: "System role is required",
    })
    role!: Roles;
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
        readonly canCreateTicket: boolean,
        readonly canResolveTicket: boolean,
        readonly isBanned: boolean,
        readonly role: Roles,
        readonly register: string,
    ) {
        super();
    }
}
