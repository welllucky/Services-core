import { Account } from "@/database/entities";
import {
    CreateAccountDTO,
    CreateUserDTO,
    Roles,
    UpdateAccountDTO,
} from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository {
    constructor(
        @InjectRepository(Account)
        private readonly repository: Repository<Account>,
    ) {}

    async findById(id: string) {
        return this.repository.findOne({
            where: { id },
            relations: {
                user: true,
            },
        });
    }

    async findByRegister(register: string) {
        return this.repository.findOne({
            where: { user: { register } },
            relations: {
                user: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.repository.findOne({
            where: { user: { email } },
            relations: {
                user: true,
            },
        });
    }

    async create(
        user: CreateUserDTO,
        account: CreateAccountDTO,
        hashedPassword: string,
    ) {
        return this.repository.save({
            ...account,
            hash: hashedPassword,
            user: {
                ...user,
                position: {
                    id: user.position,
                },
                sector: {
                    id: user.sector,
                },
            },
        });
    }

    async update(id: string, account: UpdateAccountDTO) {
        return this.repository.update(
            {
                id,
            },
            {
                ...account,
            },
        );
    }

    async updateHash(id: string, hash: string) {
        return this.repository.update(
            {
                id,
            },
            {
                hash,
            },
        );
    }

    async updateRole(id: string, role: Roles) {
        return this.repository.update(
            {
                id,
            },
            {
                role,
            },
        );
    }

    async delete(id: string) {
        return this.repository.softDelete({
            id,
        });
    }
}
