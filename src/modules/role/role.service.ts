import {
  CreateRoleDto,
  IResponseFormat,
  RoleDto,
  UpdateRoleDto,
} from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoleRepository } from "./role.repository";

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  async create(data: CreateRoleDto): Promise<IResponseFormat<CreateRoleDto>> {
    if (Object.values(data).length === 0) {
      throw new HttpException(
        {
          title: "Empty fields",
          message: "Please fill all fields.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleExist = await this.repository.findByName(data.name);

    if (roleExist) {
      throw new HttpException(
        {
          title: "Role already exists",
          message: "This Role already exists.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdRole = await this.repository.create(data);

    if (!createdRole) {
      throw new HttpException(
        {
          title: "Error",
          message: "Error on create Role.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  async getRole(id: string): Promise<IResponseFormat<RoleDto>> {
    if (!id) {
      throw new HttpException(
        {
          title: "Role id not informed",
          message: "It's necessary to inform the Role id.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const role = await this.repository.find(id);

    if (!role) {
      throw new HttpException(
        {
          title: "Role not found",
          message: "Role not found.",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: new CreateRoleDto(role.id, role.name, role.description),
      title: "Success",
      message: "Role found with success.",
    };
  }

  async getRoleByName(name: string): Promise<IResponseFormat<RoleDto>> {
    if (!name) {
      throw new HttpException(
        {
          title: "Role name not informed",
          message: "It's necessary to inform the Role name.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const role = await this.repository.findByName(name);

    if (!role) {
      throw new HttpException(
        {
          title: "Role not found",
          message: "Role not found.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: new CreateRoleDto(role.id, role.name, role.description),
      title: "Success",
      message: "Role found with success.",
    };
  }

  async getRoles(): Promise<IResponseFormat<RoleDto[]>> {
    const roles = await this.repository.findAll();

    if (!roles) {
      throw new HttpException(
        {
          title: "Roles not found",
          message: "Roles not found.",
        },
        HttpStatus.NOT_FOUND,
      );
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
      throw new HttpException(
        {
          title: "Role id not informed",
          message: "It's necessary to inform the Role id.",
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

    const Role = await this.repository.find(id);

    if (!Role) {
      throw new HttpException(
        {
          title: "Role not found",
          message: "Role not found, please check the id.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedRole = await this.repository.update(id, data);

    if (updatedRole.affected === 0) {
      throw new HttpException(
        {
          title: "Error",
          message: "Error on update Role.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      title: "Success",
      message: "Role updated with success.",
    };
  }
}
