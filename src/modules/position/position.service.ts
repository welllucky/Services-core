import {
    CreatePositionDto,
    IResponseFormat,
    PositionWithoutIdDto,
    UpdatePositionDto,
} from "@/typing";
import { Injectable } from "@nestjs/common";
import { PositionRepository } from "./position.repository";

@Injectable()
export class PositionService {
    constructor(private readonly repository: PositionRepository) {}

    async create(
        data: PositionWithoutIdDto,
    ): Promise<IResponseFormat<CreatePositionDto>> {
        if (Object.values(data).length === 0) {
            return {
                title: "Empty fields",
                message: "Please fill all fields.",
                data: null,
            };
        }

        const positionExist = await this.repository.findByName(data.name);

        if (positionExist) {
            return {
                title: "Position already exists",
                message: "This Position already exists.",
                data: null,
            };
        }

        const createdPosition = await this.repository.create(data);

        if (!createdPosition) {
            return {
                title: "Error",
                message: "Error on create Position.",
                data: null,
            };
        }

        return {
            title: "Success",
            message: "Position created with success.",
            data: new CreatePositionDto(
                createdPosition.id,
                createdPosition.name,
                createdPosition.description,
            ),
        };
    }

    async get(id: string): Promise<IResponseFormat<CreatePositionDto>> {
        if (!id) {
            return {
                title: "Position id not informed",
                message: "It's necessary to inform the Position id.",
                data: null,
            };
        }

        const position = await this.repository.find(id);

        if (!position) {
            return null;
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
            return {
                title: "Position name not informed",
                message: "It's necessary to inform the Position name.",
                data: null,
            };
        }

        const position = await this.repository.findByName(name);

        if (!position) {
            return {
                title: "Position not found",
                message: "Position not found.",
                data: null,
            };
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
            return {
                title: "Positions not found",
                message: "Positions not found.",
                data: null,
            };
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

    async update(
        id: string,
        data: UpdatePositionDto,
    ): Promise<IResponseFormat<unknown>> {
        if (!id) {
            return {
                title: "Position id not informed",
                message: "It's necessary to inform the Position id.",
                data: null,
            };
        }

        if (Object.values(data).length === 0) {
            return {
                title: "Empty fields",
                message: "Please fill all fields.",
                data: null,
            };
        }

        const Position = await this.repository.find(id);

        if (!Position) {
            return {
                title: "Position not found",
                message: "Position not found, please check the id.",
                data: null,
            };
        }

        const updatedPosition = await this.repository.update(id, data);

        if (updatedPosition.affected === 0) {
            return {
                title: "Error",
                message: "Error on update Position.",
                data: null,
            };
        }

        return {
            title: "Success",
            message: "Position updated with success.",
        };
    }

    async remove(id: string): Promise<IResponseFormat<unknown>> {
        if (!id) {
            return {
                title: "Position id not informed",
                message: "It's necessary to inform the Position id.",
                data: null,
            };
        }

        const Position = await this.repository.find(id);

        if (!Position) {
            return {
                title: "Position not found",
                message: "Position not found, please check the id.",
                data: null,
            };
        }

        const deletedPosition = await this.repository.delete(id);

        if (deletedPosition.affected === 0) {
            return {
                title: "Error",
                message: "Error on delete Position.",
                data: null,
            };
        }

        return {
            title: "Success",
            message: "Position deleted with success.",
        };
    }
}
