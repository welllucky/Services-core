import { PositionRepository } from "@/modules/shared/position/position.repository";
import {
    CreatePositionDto,
    IResponseFormat,
    PositionWithoutIdDto,
    UpdatePositionDto,
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

    async findByName(name: string) {
        const position = await this.repository.findByName(name);
        return position;
    }

    async create(
        data: PositionWithoutIdDto,
    ): Promise<IResponseFormat<CreatePositionDto>> {
        if (Object.values(data).length === 0) {
            throw new HttpException(
                {
                    title: "Empty fields",
                    message: "Please fill all fields.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const positionExist = await this.repository.findByName(data.name);

        if (positionExist) {
            throw new HttpException(
                {
                    title: "Position already exists",
                    message: "This Position already exists.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const createdPosition = await this.repository.create(data);

        if (!createdPosition) {
            throw new HttpException(
                {
                    title: "Error",
                    message: "Error on create Position.",
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
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

    async update(
        id: string,
        data: UpdatePositionDto,
    ): Promise<IResponseFormat<unknown>> {
        if (!id) {
            throw new HttpException(
                {
                    title: "Position id not informed",
                    message: "It's necessary to inform the Position id.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (Object.values(data).length === 0) {
            throw new HttpException(
                {
                    title: "Empty fields",
                    message: "Please fill all fields.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const Position = await this.repository.find(id);

        if (!Position) {
            throw new HttpException(
                {
                    title: "Position not found",
                    message: "Position not found, please check the id.",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const updatedPosition = await this.repository.update(id, data);

        if (updatedPosition.affected === 0) {
            throw new HttpException(
                {
                    title: "Error",
                    message: "Error on update Position.",
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            title: "Success",
            message: "Position updated with success.",
        };
    }

    async remove(id: string): Promise<IResponseFormat<unknown>> {
        if (!id) {
            throw new HttpException(
                {
                    title: "Position id not informed",
                    message: "It's necessary to inform the Position id.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const Position = await this.repository.find(id);

        if (!Position) {
            throw new HttpException(
                {
                    title: "Position not found",
                    message: "Position not found, please check the id.",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const deletedPosition = await this.repository.delete(id);

        if (deletedPosition.affected === 0) {
            throw new HttpException(
                {
                    title: "Error",
                    message: "Error on delete Position.",
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            title: "Success",
            message: "Position deleted with success.",
        };
    }
}
