import { Ticket } from "@/entities";
import { ITicket } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
class TicketRepository {
  constructor(
    @InjectRepository(Ticket)
    private readonly repository: Repository<Ticket>,
  ) {}

  async create(
    userId: string,
    data: Omit<
      ITicket,
      "id" | "createdAt" | "updatedAt" | "closedAt" | "updatedBy" | "closedBy"
    >,
  ) {
    return await this.repository.save({
      ...data,
      createdBy: {
        register: userId,
      },
    });
  }

  async findAll(userId: string, filters?: Partial<Omit<ITicket, "id">>) {
    return this.repository.find({
      where: [
        {
          resolver: {
            register: userId,
          },
          ...(filters as FindOptionsWhere<Ticket>),
        },
        {
          createdBy: {
            register: userId,
          },
          ...(filters as FindOptionsWhere<Ticket>),
        },
      ],
    });
  }

  async findById(userId: string, ticketId: string) {
    return this.repository.findOne({
      where: [
        {
          resolver: {
            register: userId,
          },
          id: ticketId,
        },
        {
          createdBy: {
            register: userId,
          },
          id: ticketId,
        },
      ],
    });
  }

  async update(
    userId: string,
    ticketId: string,
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
  ) {
    const result = await this.repository.update(
      {
        id: ticketId,
        createdBy: {
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
    userId: string,
    ticketId: string,
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
  ) {
    const result = await this.repository.update(
      {
        id: ticketId,
        resolver: {
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
