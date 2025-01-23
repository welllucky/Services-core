import { Role } from "@/entities";
import {
  CreateSectorDto,
  IResponseFormat,
  RoleDto,
  SectorDto,
  UpdateSectorDto,
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SectorRepository } from "./sector.repository";

@Injectable()
export class SectorService {
  constructor(private readonly repository: SectorRepository) {}

  async create(
    data: CreateSectorDto,
  ): Promise<IResponseFormat<CreateSectorDto>> {
    if (!data) {
      throw new HttpException(
        {
          title: "Empty fields",
          message: "Please fill all fields.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const sectorExist = await this.repository.findByName(data.name);

    if (sectorExist) {
      throw new HttpException(
        {
          title: "Sector already exists",
          message: "This sector already exists.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdSector = await this.repository.create(data);

    if (!createdSector) {
      throw new HttpException(
        {
          title: "Error",
          message: "Error on create sector.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      title: "Success",
      message: "Sector created with success.",
      data: new CreateSectorDto(createdSector.name, createdSector.description),
    };
  }

  async getSector(id: string): Promise<IResponseFormat<SectorDto>> {
    if (!id) {
      throw new HttpException(
        {
          title: "Sector id not informed",
          message: "It's necessary to inform the sector id.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const sector = await this.repository.find(id);

    if (!sector) {
      throw new HttpException(
        {
          title: "Sector not found",
          message: "Sector not found.",
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

  async getSectorByName(name: string): Promise<IResponseFormat<SectorDto>> {
    if (!name) {
      throw new HttpException(
        {
          title: "Sector name not informed",
          message: "It's necessary to inform the sector name.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const sector = await this.repository.findByName(name);

    if (!sector) {
      throw new HttpException(
        {
          title: "Sector not found",
          message: "Sector not found.",
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

  async getSectors(): Promise<IResponseFormat<SectorDto[]>> {
    const sectors = await this.repository.findAll();

    if (!sectors) {
      throw new HttpException(
        {
          title: "Sectors not found",
          message: "Sectors not found.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: sectors,
      title: "Success",
      message: "Sectors found with success.",
    };
  }

  async updateSector(
    id: string,
    data: UpdateSectorDto,
  ): Promise<IResponseFormat<unknown>> {
    if (!id) {
      throw new HttpException(
        {
          title: "Sector id not informed",
          message: "It's necessary to inform the sector id.",
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

    const sector = await this.repository.find(id);

    if (!sector) {
      throw new HttpException(
        {
          title: "Sector not found",
          message: "Sector not found, please check the id.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedSector = await this.repository.update(id, data);

    if (updatedSector.affected === 0) {
      throw new HttpException(
        {
          title: "Error",
          message: "Error on update sector.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      title: "Success",
      message: "Sector updated with success.",
    };
  }

  async addRole(
    data: RoleDto,
    sectorId: string,
  ): Promise<IResponseFormat<SectorDto>> {
    const errors = {
      role: {
        title: "Role not informed",
        message: "It's necessary to inform the role.",
      },
      sectorId: {
        title: "Sector id not informed",
        message: "It's necessary to inform the sector id.",
      },
    };
    if (!data || !sectorId) {
      const key = !data ? "role" : "sectorId";
      throw new HttpException(
        {
          title: errors[key].title,
          message: errors[key].message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const sector = await this.getSector(sectorId);

    if (!sector) {
      throw new HttpException(
        {
          title: "Sector not found",
          message: "Sector not found.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const role = new Role();
    role.name = data.name;
    role.description = data.description;
    role.createdAt = new Date();

    role.save();

    const updatedSector = await this.repository.update(sectorId, {
      roles: [...sector.data.roles, role],
    });

    if (updatedSector.affected === 0) {
      throw new HttpException(
        {
          title: "Error",
          message: "Error on add role.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      title: "Success",
      message: `${role.name} added to ${sector.data.name} sector successfully.`,
    };
  }
}
