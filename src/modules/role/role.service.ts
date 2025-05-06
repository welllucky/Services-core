import { CreateRoleDto, IResponseFormat, RoleWithoutIdDto, UpdateRoleDto } from "@/typing";
import { Injectable } from "@nestjs/common";
import { RoleRepository } from "./role.repository";

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  async create(
    data: RoleWithoutIdDto,
  ): Promise<IResponseFormat<CreateRoleDto>> {
    if (Object.values(data).length === 0) {
      return {
        title: "Empty fields",
        message: "Please fill all fields.",
        data: null,
      };
    }

    const roleExist = await this.repository.findByName(data.name);

    if (roleExist) {
      return {
        title: "Role already exists",
        message: "This Role already exists.",
        data: null,
      };
    }

    const createdRole = await this.repository.create(data);

    if (!createdRole) {
      return {
        title: "Error",
        message: "Error on create Role.",
        data: null,
      };
    }

    return {
      title: "Success",
      message: "Role created with success.",
      data: new CreateRoleDto(
        createdRole.id,
        createdRole.name,
        createdRole.description,
      ),
    };
  }

  async getRole(id: string): Promise<IResponseFormat<CreateRoleDto>> {
    if (!id) {
      return {
        title: "Role id not informed",
        message: "It's necessary to inform the Role id.",
        data: null,
      };
    }

    const role = await this.repository.find(id);

    if (!role) {
      return null;
    }

    return {
      data: new CreateRoleDto(role.id, role.name, role.description),
      title: "Success",
      message: "Role found with success.",
    };
  }

  async getRoleByName(name: string): Promise<IResponseFormat<CreateRoleDto>> {
    if (!name) {
      return {
        title: "Role name not informed",
        message: "It's necessary to inform the Role name.",
        data: null,
      };
    }

    const role = await this.repository.findByName(name);

    if (!role) {
      return {
        title: "Role not found",
        message: "Role not found.",
        data: null,
      };
    }

    return {
      data: new CreateRoleDto(role.id, role.name, role.description),
      title: "Success",
      message: "Role found with success.",
    };
  }

  async getRoles(): Promise<IResponseFormat<CreateRoleDto[]>> {
    const roles = await this.repository.findAll();

    if (!roles) {
      return {
        title: "Roles not found",
        message: "Roles not found.",
        data: null,
      };
    }

    return {
      data: roles.map(
        (role) => new CreateRoleDto(role.id, role.name, role.description),
      ),
      title: "Success",
      message: "Roles found with success.",
    };
  }

  async updateRole(
    id: string,
    data: UpdateRoleDto,
  ): Promise<IResponseFormat<unknown>> {
    if (!id) {
      return {
        title: "Role id not informed",
        message: "It's necessary to inform the Role id.",
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

    const Role = await this.repository.find(id);

    if (!Role) {
      return {
        title: "Role not found",
        message: "Role not found, please check the id.",
        data: null,
      };
    }

    const updatedRole = await this.repository.update(id, data);

    if (updatedRole.affected === 0) {
      return {
        title: "Error",
        message: "Error on update Role.",
        data: null,
      };
    }

    return {
      title: "Success",
      message: "Role updated with success.",
    };
  }
}
