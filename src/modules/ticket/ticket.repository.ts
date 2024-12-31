import { Ticket, User } from "@/entities";
import { ITicket } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
class TicketRepository {
  constructor(
    @InjectRepository(Ticket) private readonly repository: Repository<Ticket>,
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

  async findAll(
    userId: string,
    filters?: Partial<Omit<ITicket, "id">>,
    resolve?: boolean,
    pagination?: { page?: number; index?: number },
  ) {
    const pageIndex =
      !pagination?.index || pagination?.index === 1 ? 0 : pagination?.index;
    const page = pagination?.page || 10;

    return this.repository.find({
      where: resolve
        ? {
            resolver: {
              register: userId,
            },
            ...(filters as FindOptionsWhere<Ticket>),
          }
        : {
            createdBy: {
              register: userId,
            },
            ...(filters as FindOptionsWhere<Ticket>),
          },
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
      take: page,
      skip: pageIndex * page,
    });
  }

  async findById(userId: string, ticketId: string, resolve?: boolean) {
    return this.repository.findOne({
      where: resolve
        ? {
            resolver: {
              register: userId,
            },
            id: ticketId,
          }
        : {
            createdBy: {
              register: userId,
            },
            id: ticketId,
          },
      relations: ["user"],
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
      >
    >,
    ticketId: string,
    userId: string,
  ) {
    const result = await this.repository.update(
      {
        id: ticketId,
        updatedBy: {
          register: userId,
        },
      },
      {
        ...data,
      },
    );

    return {
      isUpdated: result.affected === 1,
    };
  }

  async updateByResolver(
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
      >
    >,
    ticketId: string,
    userId: string,
  ) {
    if (Object.keys(data).length === 0) {
      throw new Error("No update values provided");
    }

    const result = await this.repository.update(
      {
        id: ticketId,
        updatedBy: {
          register: userId,
        },
      },
      {
        ...data,
      },
    );

    return {
      isUpdated: result.affected === 1,
    };
  }
}

export { TicketRepository };
