import {
  CreateRoleDto,
  CreateSectorDto,
  IResponseFormat,
  SectorDto,
  SectorWithoutIdDto,
  UpdateSectorDto,
} from "@/typing";
import { Injectable } from "@nestjs/common";
import { RoleRepository } from "../role/role.repository";
import { SectorRepository } from "./sector.repository";

@Injectable()
export class SectorService {
  constructor(
    private readonly repository: SectorRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async create(
    data: SectorWithoutIdDto,
  ): Promise<IResponseFormat<CreateSectorDto>> {
    if (!data) {
      return {
        message: "Sector data not informed.",
        error: {
          title: "Sector data not informed",
          message: "It's necessary to inform the sector data.",
        },
      };
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
      return {
        message: "Error on create sector.",
        error: {
          title: "Error",
          message: "Error on create sector.",
        },
      };
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

  async getSector(id: string): Promise<IResponseFormat<CreateSectorDto>> {
    if (!id) {
      return {
        message: "Sector id not informed.",
        error: {
          title: "Sector id not informed",
          message: "It's necessary to inform the sector id.",
        },
      };
    }

    const sector = await this.repository.find(id);

    if (!sector) {
      return {
        message: "Sector not found.",
        error: {
          title: "Sector not found",
          message: "Sector does not exist.",
        },
      };
    }

    return {
      data: new CreateSectorDto(sector.id, sector.name, sector.description),
      title: "Success",
      message: "Sector found with success.",
    };
  }

  async getSectorByName(name: string): Promise<IResponseFormat<CreateRoleDto>> {
    if (!name) {
      return {
        message: "Sector name not informed.",
        error: {
          title: "Sector name not informed",
          message: "It's necessary to inform the sector name.",
        },
      };
    }

    const sector = await this.repository.findByName(name);

    if (!sector) {
      return {
        message: "Sector not found.",
        error: {
          title: "Sector not found",
          message: "Sector does not exist.",
        },
      };
    }

    return {
      data: sector,
      title: "Success",
      message: "Sector found with success.",
    };
  }

  async getSectors(): Promise<IResponseFormat<CreateSectorDto[]>> {
    const sectors = await this.repository.findAll();

    if (!sectors) {
      return {
        message: "Sectors not found.",
        error: {
          title: "Sectors not found",
          message: "Sectors not found.",
        },
      };
    }

    return {
      data: sectors.map(
        (sector) =>
          new CreateSectorDto(sector.id, sector.name, sector.description),
      ),
      title: "Success",
      message: "Sectors found with success.",
    };
  }

  async updateSector(
    id: string,
    data: UpdateSectorDto,
  ): Promise<IResponseFormat<unknown>> {
    if (!id) {
      return {
        message: "Sector id not informed.",
        error: {
          title: "Sector id not informed",
          message: "It's necessary to inform the sector id.",
        },
      };
    }

    if (Object.values(data).length === 0) {
      return {
        message: "Empty fields.",
        error: {
          title: "Empty fields",
          message: "Please fill all fields.",
        },
      };
    }

    const sector = await this.repository.find(id);

    if (!sector) {
      return {
        message: "Sector not found.",
        error: {
          title: "Sector not found",
          message: "Sector does not exist.",
        },
      };
    }

    const updatedSector = await this.repository.update(id, data);

    if (updatedSector.affected === 0) {
      return {
        message: "Error on update sector.",
        error: {
          title: "Error",
          message: "Error on update sector.",
        },
      };
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
      return {
        message: errors[key].message,
        error: {
          title: errors[key].title,
          message: errors[key].message,
        },
      };
    }

    const sector = await this.repository.findByName(sectorName);

    const role = await this.roleRepository.findByName(roleName);

    if (!sector || !role) {
      const key = !sector ? "sector" : "role";
      return {
        message: `${key} not found`,
        error: {
          title: `${key} not found`,
          message: `${key} not found, please check the name.`,
        },
      };
    }

    sector.roles = [...sector.roles, role];

    const updatedSector = await sector.save();

    if (!updatedSector) {
      return {
        message: "Error on add role.",
        error: {
          title: "Error",
          message: "Error on add role.",
        },
      };
    }

    return {
      title: "Success",
      message: `${role.name} added to ${sector.name} sector successfully.`,
    };
  }

  async getRoles(sectorId: string): Promise<IResponseFormat<CreateRoleDto[]>> {
    if (!sectorId) {
      return {
        message: "Sector id not informed.",
        error: {
          title: "Sector id not informed",
          message: "It's necessary to inform the sector id.",
        },
      };
    }

    const sector = await this.repository.find(sectorId);

    if (!sector) {
      return {
        message: "Sector not found.",
        error: {
          title: "Sector not found",
          message: "Sector does not exist.",
        },
      };
    }

    return {
      data: sector.roles.map(
        (role) => new CreateRoleDto(role.id, role.name, role.description),
      ),
      title: "Success",
      message: "Roles founded with success.",
    };
  }

  async getRolesByName(
    sectorId: string,
  ): Promise<IResponseFormat<CreateRoleDto[]>> {
    if (!sectorId) {
      return {
        message: "Sector id not informed.",
        error: {
          title: "Sector id not informed",
          message: "It's necessary to inform the sector id.",
        },
      };
    }

    const sector = await this.repository.findByName(sectorId);

    if (!sector) {
      return {
        message: "Sector not found.",
        error: {
          title: "Sector not found",
          message: "Sector does not exist.",
        },
      };
    }

    return {
      data: sector.roles.map(
        (role) => new CreateRoleDto(role.id, role.name, role.description),
      ),
      title: "Success",
      message: "Roles founded with success.",
    };
  }
}
