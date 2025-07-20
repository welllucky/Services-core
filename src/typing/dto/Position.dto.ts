import { PartialType, PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class PositionDto {
    @IsString({ message: "Id must be a string" })
    @ApiProperty({
        description: "Position ID",
        type: "string",
        example: "123456",
    })
    id!: string;

    @IsString({ message: "Name must be a string" })
    @MinLength(3, { message: "Name must have a minimum of 3 characters" })
    @MaxLength(128, { message: "Name must have a maximum of 128 characters" })
    @ApiProperty({
        description: "Position name",
        type: "string",
        example: "Senior Developer",
    })
    name!: string;

    @IsString({ message: "Description must be a string" })
    @MaxLength(128, {
        message: "Description must have a maximum of 128 characters",
    })
    @ApiProperty({
        description: "Position description",
        type: "string",
        example: "Senior Developer",
    })
    description!: string;
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
