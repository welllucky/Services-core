import { Event } from "@/entities";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import {
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { PriorityLevels } from "../interfaces";
import { TicketType, TicketTypeArray } from "../types";
import { TicketStatus, TicketStatusArray } from "../types/TicketStatus";

export class TicketDto {
  @IsString({ message: "Id must be a string" })
  id: string;

  @IsString({ message: "Resume must be a string" })
  @MinLength(20, { message: "Resume must have a minimum of 20 characters" })
  @MaxLength(80, { message: "Resume must have a maximum of 80 characters" })
  resume: string;

  @IsString({ message: "Description must be a string" })
  @MinLength(50, {
    message: "Description must have a minimum of 50 characters",
  })
  @MaxLength(460, {
    message: "Description must have a maximum of 460 characters",
  })
  description: string;

  @IsString({ message: "Priority must be a string" })
  @IsIn(["low", "medium", "high"], {
    message: "Priority must be 'low', 'medium' or 'high'",
  })
  priority: PriorityLevels;

  @IsString({ message: "Type must be a string" })
  @IsIn(TicketTypeArray, {
    message: "Type must be 'low', 'medium' or 'high'",
  })
  type: TicketType;

  @IsString({ message: "Status must be a string" })
  @IsIn(TicketStatusArray, {
    message: "Status must be 'low', 'medium' or 'high'",
  })
  status: TicketStatus;

  @IsString({ message: "Date must be a string" })
  @IsOptional()
  resolver?: string | null;

  @IsOptional()
  events?: Event[] | null;

  @IsDate({ message: "Date must be a date" })
  date: Date;

  @IsDate({ message: "CreatedAt must be a date" })
  createdAt: Date;

  @IsDate({ message: "UpdatedAt must be a date" })
  @IsOptional()
  updatedAt?: Date | null;

  @IsDate({ message: "ClosedAt must be a date" })
  @IsOptional()
  closedAt?: Date | null;

  @IsDate({ message: "UpdateAt must be a date" })
  @IsOptional()
  updatedBy?: string | null;

  @IsDate({ message: "CreatedBy must be a date" })
  @IsOptional()
  createdBy?: string | null;

  @IsString({ message: "ClosedBy must be a string" })
  @IsOptional()
  closedBy?: string | null;
}

export class CreateTicketDto extends PickType(TicketDto, [
  "resume",
  "description",
  "priority",
  "date",
  "type"
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
