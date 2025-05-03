import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsString, MaxLength, MinLength } from "class-validator";

export class RoleDto {
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

export class CreateRoleDto extends PickType(RoleDto, ["name", "description"]) {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
  ) {
    super();
  }
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
