import { Position } from "@/database/entities";
import { PositionWithoutIdDto, UpdatePositionDto } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PositionRepository {
    constructor(
        @InjectRepository(Position)
        private readonly repository: Repository<Position>,
    ) {}

    async find(id: string) {
        return this.repository.findOneBy({
            id,
        });
    }

    async findByName(name: string) {
        return this.repository.findOneBy({
            name,
        });
    }

    async findAll() {
        return this.repository.find();
    }

    async create(data: PositionWithoutIdDto) {
        return this.repository.save({
            ...data,
            createdAt: new Date(),
        });
    }

    async update(id: string, data: Partial<UpdatePositionDto>) {
        return this.repository.update(
            {
                id,
            },
            {
                ...data,
                updatedAt: new Date(),
            },
        );
    }

    async delete(id: string) {
        return this.repository.delete({
            id,
        });
    }
}
