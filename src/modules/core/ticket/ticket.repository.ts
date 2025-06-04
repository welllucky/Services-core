import { Ticket, User } from "@/entities";
import { ITicket } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, Repository } from "typeorm";

@Injectable()
class TicketRepository {
    constructor(
        @InjectRepository(Ticket)
        private readonly repository: Repository<Ticket>,
    ) {}

    async create(
        data: Omit<
            ITicket,
            | "id"
            | "createdAt"
            | "updatedAt"
            | "closedAt"
            | "updatedBy"
            | "closedBy"
            | "status"
        >,
        user: User,
    ) {
        return this.repository.save({
            ...data,
            createdBy: user,
        });
    }

    async findAll({
        userId,
        filters,
        isSolver,
        pagination,
    }: {
        userId: string;
        filters?: Partial<Omit<ITicket, "id">>;
        isSolver?: boolean;
        pagination?: { page?: number; index?: number };
    }) {
        const pageIndex =
            !pagination?.index || pagination?.index === 1
                ? 0
                : pagination?.index;
        const page = pagination?.page || 10;

        return this.repository.find({
            where: {
                ...(isSolver && {
                    resolver: {
                        register: userId,
                    },
                }),
                ...(!isSolver && {
                    createdBy: {
                        register: userId,
                    },
                }),
                ...(filters as FindOptionsWhere<Ticket>),
            },
            relations: {
                createdBy: true,
                closedBy: true,
                updatedBy: true,
            },
            order: {
                createdAt: "DESC",
            },
            take: page,
            skip: pageIndex * page,
        });
    }

    async findById(userId: string, ticketId: string, isSolver?: boolean) {
        return this.repository.findOne({
            where: {
                ...(isSolver && {
                    resolver: {
                        register: userId,
                    },
                }),
                ...(!isSolver && {
                    createdBy: {
                        register: userId,
                    },
                }),
                id: ticketId,
            },
            relations: {
                closedBy: true,
                createdBy: true,
                resolver: true,
                updatedBy: true,
            },
        });
    }

    async update(
        data: Partial<
            Omit<
                ITicket,
                | "closedAt"
                | "updateAt"
                | "createdAt"
                | "createdBy"
                | "updatedBy"
                | "closedBy"
                | "id"
                | "historic"
            >
        >,
        ticketId: string,
        userId: string,
        isSolver?: boolean,
    ) {
        // First, check if the ticket exists and belongs to the resolver
        const ticket = await this.repository.findOne({
            where: {
                id: ticketId,
                ...(isSolver && {
                    resolver: {
                        register: userId,
                    },
                }),
                ...(!isSolver && {
                    createdBy: {
                        register: userId,
                    },
                }),
            },
        });

        if (!ticket) {
            return { isUpdated: false }; // Ticket not found or not assigned to this resolver
        }

        // Perform the update
        const result = await this.repository.update(
            { id: ticketId }, // Simple where clause, no relations
            data,
        );

        return {
            isUpdated: result.affected === 1,
        };
    }

    findAnyIssueByIdOrName(
        userId: string,
        searchTerm: string,
        pagination?: { page?: number; index?: number },
    ) {
        const pageIndex =
            !pagination?.index || pagination?.index === 1
                ? 0
                : pagination?.index;
        const page = pagination?.page || 10;

        return this.repository.find({
            where: [
                {
                    description: ILike(`%${searchTerm}%`),
                    createdBy: { register: userId },
                },
                {
                    resume: ILike(`%${searchTerm}%`),
                    createdBy: { register: userId },
                },
                {
                    id: ILike(`%${searchTerm}%`),
                    createdBy: { register: userId },
                },
                {
                    description: ILike(`%${searchTerm}%`),
                    resolver: { register: userId },
                },
                {
                    resume: ILike(`%${searchTerm}%`),
                    resolver: { register: userId },
                },
                {
                    id: ILike(`%${searchTerm}%`),
                    resolver: { register: userId },
                },
            ],
            relations: {
                createdBy: true,
                resolver: true,
            },
            order: {
                createdAt: "DESC",
            },
            take: page,
            skip: pageIndex * page,
        });
    }
}

export { TicketRepository };
