import { Role } from "@/entities";
import { CreateRoleDto, UpdateRoleDto } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
  ) {}

  async find(id: string) {
    return this.repository.findOneBy({
      id: id,
    });
  }

  async findByName(name: string) {
    return this.repository.findOneBy({
      name: name,
    });
  }

  findAll() {
    return this.repository.find();
  }

  async create(data: CreateRoleDto) {
    return this.repository.save({
      ...data,
      createdAt: new Date(),
    });
  }

  async update(id: string, data: Partial<UpdateRoleDto>) {
    return this.repository.update(
      {
        id: id,
      },
      {
        ...data,
        updatedAt: new Date(),
      },
    );
  }
}
