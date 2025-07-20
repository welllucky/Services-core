// user.repository.ts
import { Session } from "@/database/entities";
import { Pagination, SessionStatus } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {}

  async findAll(
    userId: string,
    status: SessionStatus,
    pagination?: Pagination,
  ): Promise<Session[]> {
    const pageIndex =
      !pagination?.index || pagination?.index === 1 ? 0 : pagination?.index;
    const page = pagination?.page ?? 10;

    const whereConditions = {
      isActive: status === "all" ? undefined : status === "active",
    };

    return this.repository.find({
      where: [
        {
          user: {
            register: userId,
          },
          ...whereConditions,
        },
        {
          user: {
            id: userId,
          },
          ...whereConditions,
        },
      ],
      relations: {
        user: true,
      },
      order: {
        createdAt: "DESC",
      },
      take: page,
      skip: pageIndex * page,
    });
  }

  async find(
    userId: string,
    sessionId?: string,
    status: SessionStatus = "active",
  ): Promise<Session | null> {
    const whereConditions = {
      ...(sessionId && { id: sessionId }),
      isActive: status === "all" ? undefined : status === "active",
    };
    return this.repository.findOne({
      where: [
        {
          user: {
            id: userId,
          },
          ...whereConditions,
        },
        {
          user: {
            register: userId,
          },
          ...whereConditions,
        },
      ],
      relations: {
        user: true,
      },
      order: {
        createdAt: "ASC",
      },
    });
  }

  async update(sessionId: string, session: Partial<Session>, userId: string) {
    return this.repository.update(
      {
        id: sessionId,
        user: {
          id: userId,
        },
      },
      {
        ...session,
      },
    );
  }

  async create(userId: string, expiresAt: Date) {
    return this.repository.save({
      createdAt: new Date(),
      isActive: true,
      user: {
        id: userId,
      },
      expiresAt,
    });
  }
}
