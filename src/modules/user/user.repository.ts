import { User } from "@/entities";
import { CreateUserDTO, Pagination, UpdateUserDTO } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async findAll(pagination?: Pagination): Promise<User[]> {
    const pageIndex =
      !pagination?.index || pagination?.index === 1 ? 0 : pagination?.index;
    const page = pagination?.page || 10;

    return this.repository.find({
      order: {
        createdAt: "DESC",
      },
      take: page,
      skip: pageIndex * page,
      relations: {
        role: true,
        sector: true,
      },
    });
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: {
        role: true,
        sector: true,
      },
    });
  }

  async findByRegister(register: string) {
    return this.repository.findOne({
      where: { register },
      relations: {
        role: true,
        sector: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: {
        role: true,
        sector: true,
      },
    });
  }

  async create(user: Omit<CreateUserDTO, "password">, password: string) {
    return this.repository.save(
      {
        ...user,
        role: {
          id: user.role,
        },
        sector: {
          id: user.sector,
        },
      },
      {
        data: {
          rootPassword: password,
        },
      },
    );
  }

  async update(userId: string, user: UpdateUserDTO) {
    return this.repository.update(
      {
        register: userId,
      },
      {
        ...user,
        role: user.role ? { id: user.role } : undefined,
        sector: user.sector ? { id: user.sector } : undefined,
      },
    );
  }
}
