import { Event } from "@/database/entities";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import {
    IsArray,
    IsDate,
    IsIn,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";
import { PriorityLevels } from "../interfaces";
import { TicketType, TicketTypeArray } from "../types";
import { TicketStatus, ticketStatusArray } from "../types/TicketStatus";
import { ApiProperty } from "@nestjs/swagger";

export class TicketDto {
    @IsString({ message: "Id must be a string" })
    @ApiProperty({
        description: "Ticket ID",
        type: "string",
        example: "123456",
    })
    id!: string;

    @IsString({ message: "Resume must be a string" })
    @MinLength(20, { message: "Resume must have a minimum of 20 characters" })
    @MaxLength(80, { message: "Resume must have a maximum of 80 characters" })
    @ApiProperty({
        description: "Ticket resume",
        type: "string",
        example: "Resume",
    })
    resume!: string;

    @IsString({ message: "Description must be a string" })
    @MinLength(50, {
        message: "Description must have a minimum of 50 characters",
    })
    @MaxLength(460, {
        message: "Description must have a maximum of 460 characters",
    })
    @ApiProperty({
        description: "Ticket description",
        type: "string",
        example: "Description",
    })
    description!: string;

    @IsString({ message: "Priority must be a string" })
    @IsIn(["low", "medium", "high"], {
        message: "Priority must be 'low', 'medium' or 'high'",
    })
    @ApiProperty({
        description: "Ticket priority",
        type: "string",
        example: "low",
    })
    priority!: PriorityLevels;

    @IsString({ message: "Type must be a string" })
    @IsIn(TicketTypeArray, {
        message: "Type must be 'low', 'medium' or 'high'",
    })
    @ApiProperty({
        description: "Ticket type",
        type: "string",
        example: "low",
    })
    type!: TicketType;

    @IsString({ message: "Status must be a string" })
    @IsIn(ticketStatusArray, {
        message: "Status must be 'low', 'medium' or 'high'",
    })
    @ApiProperty({
        description: "Ticket status",
        type: "string",
        example: "low",
    })
    status!: TicketStatus;

    @IsString({ message: "Date must be a string" })
    @IsOptional()
    @ApiProperty({
        description: "Ticket resolver",
        type: "string",
        example: "Resolver",
    })
    resolver?: string | null;

    @ApiProperty({
        description: "Ticket events",
        type: "array",
        example: [],
    })
    @IsOptional()
    @IsArray()
    events?: Event[] | null;

    @IsDate({ message: "Date must be a date" })
    @ApiProperty({
        description: "Ticket date",
        type: "string",
        example: "2022-01-01T00:00:00.000Z",
    })
    date!: Date;

    @IsDate({ message: "CreatedAt must be a date" })
    @ApiProperty({
        description: "Ticket created at",
        type: "string",
        example: "2022-01-01T00:00:00.000Z",
    })
    createdAt!: Date;

    @IsDate({ message: "UpdatedAt must be a date" })
    @IsOptional()
    @ApiProperty({
        description: "Ticket updated at",
        type: "string",
        example: "2022-01-01T00:00:00.000Z",
    })
    updatedAt?: Date | null;

    @IsDate({ message: "ClosedAt must be a date" })
    @IsOptional()
    @ApiProperty({
        description: "Ticket closed at",
        type: "string",
        example: "2022-01-01T00:00:00.000Z",
    })
    closedAt?: Date | null;

    @IsDate({ message: "UpdateAt must be a date" })
    @IsOptional()
    @ApiProperty({
        description: "Ticket updated by",
        type: "string",
        example: "UpdatedBy",
    })
    updatedBy?: string | null;

    @IsDate({ message: "CreatedBy must be a date" })
    @IsOptional()
    @ApiProperty({
        description: "Ticket created by",
        type: "string",
        example: "CreatedBy",
    })
    createdBy?: string | null;

    @IsString({ message: "ClosedBy must be a string" })
    @IsOptional()
    @ApiProperty({
        description: "Ticket closed by",
        type: "string",
        example: "ClosedBy",
    })
    closedBy?: string | null;
}

export class CreateTicketDto extends PickType(TicketDto, [
    "resume",
    "description",
    "priority",
    "date",
    "type",
]) {}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class PublicTicketDto extends OmitType(TicketDto, [
    "updatedAt",
    "updatedBy",
]) {
    constructor(
        readonly id: string,
        readonly resume: string,
        readonly description: string,
        readonly date: Date,
        readonly priority: PriorityLevels,
        readonly type: TicketType,
        readonly status: TicketStatus,
        readonly resolver: string | null,
        // readonly events: Event[] | null,
        readonly createdAt: Date,
        readonly closedAt: Date | null,
        readonly createdBy: string,
        readonly closedBy: string | null,
    ) {
        super();
    }
}

export class SearchedTicketDto extends OmitType(TicketDto, [
    "updatedAt",
    "updatedBy",
    "createdAt",
    "closedAt",
    "createdBy",
    "closedBy",
]) {
    constructor(
        readonly id: string,
        readonly resume: string,
        readonly description: string,
        readonly date: Date,
        readonly priority: PriorityLevels,
        readonly type: TicketType,
        readonly status: TicketStatus,
        readonly createdBy: string,
        readonly resolver: string | null,
    ) {
        super();
    }
}
