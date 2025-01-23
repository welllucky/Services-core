import { IsString, MaxLength, MinLength } from "class-validator";

export class RoleDto {
  @IsString({ message: "Id must be a string" })
  id: string;

  @IsString({ message: "Name must be a string" })
  @MinLength(4, { message: "Name must have a minimum of 4 characters" })
  @MaxLength(128, { message: "Name must have a maximum of 128 characters" })
  name: string;

  @IsString({ message: "Description must be a string" })
  @MaxLength(128, {
    message: "Description must have a maximum of 128 characters",
  })
  description: string;
}
