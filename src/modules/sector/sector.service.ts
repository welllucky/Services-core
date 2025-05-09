import {
    CreatePositionDto,
    CreateSectorDto,
    IResponseFormat,
    SectorDto,
    SectorWithoutIdDto,
    UpdateSectorDto,
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PositionRepository } from "../position/position.repository";
import { SectorRepository } from "./sector.repository";

@Injectable()
export class SectorService {
    constructor(
        private readonly repository: SectorRepository,
        private readonly roleRepository: PositionRepository,
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

    async update(
        id: string,
        data: UpdateSectorDto,
    ): Promise<IResponseFormat<unknown>> {
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

        if (Object.values(data).length === 0) {
            throw new HttpException(
                {
                    message: "Empty fields.",
                    error: {
                        title: "Empty fields",
                        message: "Please fill all fields.",
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

        const updatedSector = await this.repository.update(id, data);

        if (updatedSector.affected === 0) {
            throw new HttpException(
                {
                    message: "Error on update sector.",
                    error: {
                        title: "Error",
                        message: "Error on update sector.",
                    },
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            title: "Success",
            message: "Sector updated with success.",
        };
    }

    async addPosition(
        roleName: string,
        sectorName: string,
    ): Promise<IResponseFormat<SectorDto>> {
        const errors = {
            role: {
                title: "Position not informed",
                message: "It's necessary to inform the role.",
            },
            sector: {
                title: "Sector id not informed",
                message: "It's necessary to inform the sector id.",
            },
        };

        if (!roleName || !sectorName) {
            const key = !roleName ? "role" : "sector";
            throw new HttpException(
                {
                    message: errors[key].message,
                    error: {
                        title: errors[key].title,
                        message: errors[key].message,
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const sector = await this.repository.findByName(sectorName);

        const role = await this.roleRepository.findByName(roleName);

        if (!sector || !role) {
            const key = !sector ? "sector" : "role";
            throw new HttpException(
                {
                    message: `${key} not found`,
                    error: {
                        title: `${key} not found`,
                        message: `${key} not found, please check the name.`,
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        sector.positions = [...sector.positions, role];

        const updatedSector = await sector.save();

        if (!updatedSector) {
            throw new HttpException(
                {
                    message: "Error on add role.",
                    error: {
                        title: "Error",
                        message: "Error on add role.",
                    },
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            title: "Success",
            message: `${role.name} added to ${sector.name} sector successfully.`,
        };
    }

    async removePosition(
        roleName: string,
        sectorName: string,
    ): Promise<IResponseFormat<SectorDto>> {
        const errors = {
            role: {
                title: "Position not informed",
                message: "It's necessary to inform the role.",
            },
            sector: {
                title: "Sector id not informed",
                message: "It's necessary to inform the sector id.",
            },
        };
        if (!roleName || !sectorName) {
            const key = !roleName ? "role" : "sector";
            throw new HttpException(
                {
                    message: errors[key].message,
                    error: {
                        title: errors[key].title,
                        message: errors[key].message,
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const sector = await this.repository.findByName(sectorName);
        const role = await this.roleRepository.findByName(roleName);

        if (!sector || !role) {
            const key = !sector ? "sector" : "role";
            throw new HttpException(
                {
                    message: `${key} not found`,
                    error: {
                        title: `${key} not found`,
                        message: `${key} not found, please check the name.`,
                    },
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const roleIndex = sector.positions.findIndex((r) => r.id === role.id);
        if (roleIndex === -1) {
            throw new HttpException(
                {
                    message: "Position not found in sector.",
                    error: {
                        title: "Position not found",
                        message: "Position not found in sector.",
                    },
                },
                HttpStatus.NOT_FOUND,
            );
        }
        sector.positions.splice(roleIndex, 1);
        const updatedSector = await sector.save();
        if (!updatedSector) {
            throw new HttpException(
                {
                    message: "Error on remove role.",
                    error: {
                        title: "Error",
                        message: "Error on remove role.",
                    },
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return {
            title: "Success",
            message: `${role.name} removed from ${sector.name} sector successfully.`,
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
            data: sector.positions.map(
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
            data: sector.positions.map(
                (role) =>
                    new CreatePositionDto(role.id, role.name, role.description),
            ),
            title: "Success",
            message: "Positions founded with success.",
        };
    }

    async removeSector(id: string): Promise<IResponseFormat<unknown>> {
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

        const deletedSector = await this.repository.delete(id);

        if (deletedSector.affected === 0) {
            throw new HttpException(
                {
                    message: "Error on delete sector.",
                    error: {
                        title: "Error",
                        message: "Error on delete sector.",
                    },
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            title: "Success",
            message: "Sector deleted with success.",
        };
    }
}
