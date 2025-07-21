import { PickType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsString,
} from "class-validator";
import { Roles } from "../types";
import { SessionDTO } from "./Session.dto";
import { UserDTO } from "./User.dto";

export class AccountDTO {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    @Type(() => UserDTO)
    user!: UserDTO;

    @IsString()
    @IsNotEmpty()
    hash!: string;

    @IsBoolean()
    @IsNotEmpty()
    isBanned!: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canCreateTicket!: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canResolveTicket!: boolean;

    @IsString({
        message: "System role must be a string",
    })
    @IsNotEmpty({
        message: "System role is required",
    })
    role!: Roles;

    @IsArray()
    @Type(() => SessionDTO)
    sessions!: SessionDTO[];

    @IsDate()
    createdAt!: Date;

    @IsDate()
    updatedAt!: Date | null;

    @IsDate()
    deletedAt!: Date | null;
}

export class CreateAccountDTO extends PickType(AccountDTO, [
    "isBanned",
    "canCreateTicket",
    "canResolveTicket",
    "role",
]) {}

export class UpdateAccountDTO extends PickType(AccountDTO, [
    "isBanned",
    "canCreateTicket",
    "canResolveTicket",
    "role",
    "hash",
    "sessions",
]) {}
