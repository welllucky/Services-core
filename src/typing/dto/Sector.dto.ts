import { PartialType, PickType } from "@nestjs/mapped-types";
import {
    IsArray,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";
import { PositionDto } from "./Position.dto";

export class SectorDto {
    @IsString({ message: "Id must be a string" })
    id!: string;

    @IsString({ message: "Name must be a string" })
    @MinLength(2, { message: "Name must have a minimum of 2 characters" })
    @MaxLength(128, { message: "Name must have a maximum of 128 characters" })
    name!: string;

    @IsString({ message: "Description must be a string" })
    @MaxLength(128, {
        message: "Description must have a maximum of 128 characters",
    })
    description!: string;

    @IsArray()
    @IsOptional()
    roles?: PositionDto[];
}

export class SectorWithoutIdDto extends PickType(SectorDto, [
    "name",
    "description",
]) {
    constructor(
        readonly name: string,
        readonly description: string,
    ) {
        super();
    }
}

export class CreateSectorDto extends PickType(SectorDto, [
    "id",
    "name",
    "description",
]) {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
    ) {
        super();
    }
}

export class AlterSectorDto extends PickType(SectorDto, [
    "name",
    "description",
    "roles",
]) {}

export class UpdateSectorDto extends PartialType(SectorWithoutIdDto) {}
