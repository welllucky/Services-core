import { PartialType, PickType } from "@nestjs/mapped-types";
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { RoleDto } from "./Role.dto";

export class SectorDto {
  @IsString({ message: "Id must be a string" })
  id: string;

  @IsString({ message: "Name must be a string" })
  @MinLength(2, { message: "Name must have a minimum of 2 characters" })
  @MaxLength(128, { message: "Name must have a maximum of 128 characters" })
  name: string;

  @IsString({ message: "Description must be a string" })
  @MaxLength(128, {
    message: "Description must have a maximum of 128 characters",
  })
  description: string;

  @IsArray()
  @IsOptional()
  roles?: RoleDto[];
}

export class AlterSectorDto extends PickType(SectorDto, [
  "id",
  "name",
  "description",
  "roles",
]) {}

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

export class UpdateSectorDto extends PartialType(CreateSectorDto) {}
