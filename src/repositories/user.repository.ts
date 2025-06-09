import { User } from "@/entities";
import { CreateUserDTO, Pagination, Roles, UpdateUserDTO } from "@/typing";
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
            !pagination?.index || pagination?.index === 1
                ? 0
                : pagination?.index;
        const page = pagination?.page ?? 10;

        return this.repository.find({
            order: {
                createdAt: "DESC",
            },
            take: page,
            skip: pageIndex * page,
            relations: {
                position: true,
                sector: true,
            },
        });
    }

    async findById(id: string) {
        return this.repository.findOne({
            where: { id },
            relations: {
                position: true,
                sector: true,
            },
        });
    }

    async findByRegister(register: string) {
        return this.repository.findOne({
            where: { register },
            relations: {
                position: true,
                sector: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.repository.findOne({
            where: { email },
            relations: {
                position: true,
                sector: true,
            },
        });
    }

    async create(user: Omit<CreateUserDTO, "password">, password: string) {
        return this.repository.save(
            {
                ...user,
                position: {
                    id: user.position,
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

    async update(register: string, user: UpdateUserDTO) {
        return this.repository.update(
            {
                register,
            },
            {
                ...user,
                position: user.position ? { id: user.position } : undefined,
                sector: user.sector ? { id: user.sector } : undefined,
            },
        );
    }

    async updateRole(register: string, role: Roles) {
        return this.repository.update(
            {
                register,
            },
            {
                role,
            },
        );
    }
}
