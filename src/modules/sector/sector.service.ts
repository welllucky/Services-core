import {
  CreateSectorDto,
  IResponseFormat,
  RoleDto,
  SectorDto,
  UpdateSectorDto,
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoleRepository } from "../role/role.repository";
import { SectorRepository } from "./sector.repository";

@Injectable()
export class SectorService {
  constructor(
    private readonly repository: SectorRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

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
    roleName: string,
    sectorName: string,
  ): Promise<IResponseFormat<SectorDto>> {
    const errors = {
      role: {
        title: "Role not informed",
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
          title: errors[key].title,
          message: errors[key].message,
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
          title: `${key} not found`,
          message: `${key} not found, please check the name.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    sector.roles = [...sector.roles, role];

    const updatedSector = await sector.save();

    if (!updatedSector) {
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
      message: `${role.name} added to ${sector.name} sector successfully.`,
    };
  }

  async getRoles(sectorId: string): Promise<IResponseFormat<RoleDto[]>> {
    if (!sectorId) {
      throw new HttpException(
        {
          title: "Sector id not informed",
          message: "It's necessary to inform the sector id.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const sector = await this.getSector(sectorId);

    return {
      data: sector.data.roles,
      title: "Success",
      message: "Roles founded with success.",
    };
  }
}
