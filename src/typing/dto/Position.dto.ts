import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsString, MaxLength, MinLength } from "class-validator";

export class PositionDto {
  @IsString({ message: "Id must be a string" })
  id: string;

  @IsString({ message: "Name must be a string" })
  @MinLength(3, { message: "Name must have a minimum of 3 characters" })
  @MaxLength(128, { message: "Name must have a maximum of 128 characters" })
  name: string;

  @IsString({ message: "Description must be a string" })
  @MaxLength(128, {
    message: "Description must have a maximum of 128 characters",
  })
  description: string;
}

export class CreatePositionDto extends PickType(PositionDto, [
  "name",
  "description",
  "id",
]) {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
  ) {
    super();
  }
}

export class PositionWithoutIdDto extends PickType(PositionDto, [
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

export class UpdatePositionDto extends PartialType(PositionWithoutIdDto) {}
