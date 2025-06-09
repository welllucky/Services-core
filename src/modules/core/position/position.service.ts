import { PositionRepository } from "@/repositories/position.repository";
import {
    CreatePositionDto,
    IResponseFormat
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class PositionService {
    constructor(
        private readonly repository: PositionRepository,
    ) {}

    async get(id: string): Promise<IResponseFormat<CreatePositionDto>> {
        if (!id) {
            throw new HttpException(
                {
                    title: "Position id not informed",
                    message: "It's necessary to inform the Position id.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const position = await this.repository.find(id);

        if (!position) {
            throw new HttpException(
                {
                    title: "Position not found",
                    message: "Position not found.",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: new CreatePositionDto(
                position.id,
                position.name,
                position.description,
            ),
            title: "Success",
            message: "Position found with success.",
        };
    }

    async getByName(name: string): Promise<IResponseFormat<CreatePositionDto>> {
        if (!name) {
            throw new HttpException(
                {
                    title: "Position name not informed",
                    message: "It's necessary to inform the Position name.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const position = await this.repository.findByName(name);

        if (!position) {
            throw new HttpException(
                {
                    title: "Position not found",
                    message: "Position not found.",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: new CreatePositionDto(
                position.id,
                position.name,
                position.description,
            ),
            title: "Success",
            message: "Position found with success.",
        };
    }

    async getAll(): Promise<IResponseFormat<CreatePositionDto[]>> {
        const positions = await this.repository.findAll();

        if (!positions) {
            throw new HttpException(
                {
                    title: "Positions not found",
                    message: "Positions not found.",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: positions.map(
                (position) =>
                    new CreatePositionDto(
                        position.id,
                        position.name,
                        position.description,
                    ),
            ),
            title: "Success",
            message: "Positions found with success.",
        };
    }
}
