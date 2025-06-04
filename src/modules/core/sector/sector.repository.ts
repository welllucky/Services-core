import { Sector } from "@/entities";
import { AlterSectorDto } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SectorRepository {
    constructor(
        @InjectRepository(Sector)
        private readonly repository: Repository<Sector>,
    ) {}

    async find(id: string) {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: {
                positions: true,
            },
        });
    }

    async findByName(name: string) {
        return this.repository.findOne({
            where: {
                name,
            },
            relations: {
                positions: true,
            },
        });
    }

    findAll() {
        return this.repository.find();
    }

    async create(data: AlterSectorDto) {
        return this.repository.save({
            ...data,
            createdAt: new Date(),
        });
    }

    async update(id: string, data: Partial<AlterSectorDto>) {
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

    async delete(id: string) {
        return this.repository.delete(id);
    }
}
