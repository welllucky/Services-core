import { SectorRepository } from "@/repositories";
import {
    CreatePositionDto,
    CreateSectorDto,
    IResponseFormat,
    SectorWithoutIdDto
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class SectorService {
    constructor(
        private readonly repository: SectorRepository,
    ) {}

    async create(
        data: SectorWithoutIdDto,
    ): Promise<IResponseFormat<CreateSectorDto>> {
        if (!data) {
            throw new HttpException(
                {
                    message: "Sector data not informed.",
                    error: {
                        title: "Sector data not informed",
                        message: "It's necessary to inform the sector data.",
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const sectorExist = await this.repository.findByName(data.name);

        if (sectorExist) {
            return {
                message: "Sector already exists.",
                error: {
                    title: "Sector already exists",
                    message: "This sector already exists.",
                },
            };
        }

        const createdSector = await this.repository.create(data);

        if (!createdSector) {
            throw new HttpException(
                {
                    message: "Error on create sector.",
                    error: {
                        title: "Error",
                        message: "Error on create sector.",
                    },
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            title: "Success",
            message: "Sector created with success.",
            data: new CreateSectorDto(
                createdSector.id,
                createdSector.name,
                createdSector.description,
            ),
        };
    }

    async get(id: string): Promise<IResponseFormat<CreateSectorDto>> {
        if (!id) {
            throw new HttpException(
                {
                    message: "Sector id not informed.",
                    error: {
                        title: "Sector id not informed",
                        message: "It's necessary to inform the sector id.",
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const sector = await this.repository.find(id);

        if (!sector) {
            throw new HttpException(
                {
                    message: "Sector not found.",
                    error: {
                        title: "Sector not found",
                        message: "Sector does not exist.",
                    },
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: new CreateSectorDto(
                sector.id,
                sector.name,
                sector.description,
            ),
            title: "Success",
            message: "Sector found with success.",
        };
    }

    async getByName(name: string): Promise<IResponseFormat<CreatePositionDto>> {
        if (!name) {
            throw new HttpException(
                {
                    message: "Sector name not informed.",
                    error: {
                        title: "Sector name not informed",
                        message: "It's necessary to inform the sector name.",
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const sector = await this.repository.findByName(name);

        if (!sector) {
            throw new HttpException(
                {
                    message: "Sector not found.",
                    error: {
                        title: "Sector not found",
                        message: "Sector does not exist.",
                    },
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: sector,
            title: "Success",
            message: "Sector found with success.",
        };
    }

    async getAll(): Promise<IResponseFormat<CreateSectorDto[]>> {
        const sectors = await this.repository.findAll();

        if (!sectors) {
            throw new HttpException(
                {
                    message: "Sectors not found.",
                    error: {
                        title: "Sectors not found",
                        message: "Sectors not found.",
                    },
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: sectors.map(
                (sector) =>
                    new CreateSectorDto(
                        sector.id,
                        sector.name,
                        sector.description,
                    ),
            ),
            title: "Success",
            message: "Sectors found with success.",
        };
    }

    async getPositions(
        sectorId: string,
    ): Promise<IResponseFormat<CreatePositionDto[]>> {
        if (!sectorId) {
            throw new HttpException(
                {
                    message: "Sector id not informed.",
                    error: {
                        title: "Sector id not informed",
                        message: "It's necessary to inform the sector id.",
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const sector = await this.repository.find(sectorId);

        if (!sector) {
            throw new HttpException(
                {
                    message: "Sector not found.",
                    error: {
                        title: "Sector not found",
                        message: "Sector does not exist.",
                    },
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: sector.positions?.map(
                (role) =>
                    new CreatePositionDto(role.id, role.name, role.description),
            ),
            title: "Success",
            message: "Positions founded with success.",
        };
    }

    async getPositionsByName(
        sectorId: string,
    ): Promise<IResponseFormat<CreatePositionDto[]>> {
        if (!sectorId) {
            throw new HttpException(
                {
                    message: "Sector id not informed.",
                    error: {
                        title: "Sector id not informed",
                        message: "It's necessary to inform the sector id.",
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const sector = await this.repository.findByName(sectorId);

        if (!sector) {
            throw new HttpException(
                {
                    message: "Sector not found.",
                    error: {
                        title: "Sector not found",
                        message: "Sector does not exist.",
                    },
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: sector.positions?.map(
                (role) =>
                    new CreatePositionDto(role.id, role.name, role.description),
            ),
            title: "Success",
            message: "Positions founded with success.",
        };
    }
}
