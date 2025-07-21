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

  async findLastActiveByUserRegister(register: string): Promise<Session | null> {
    return this.repository.findOne({
      where: {
        account: {
          user: {
            register,
          },
        },
        isActive: true,
      },
      relations: {
        account: true,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findAll(
    userRegister: string,
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
      where: {
          account: {
            user: {
              register: userRegister,
            },
          },
          ...whereConditions,
        },
      relations: {
        account: {
          user: true
        }
      },
      order: {
        createdAt: "DESC",
      },
      take: page,
      skip: pageIndex * page,
    });
  }

  async find(
    sessionId: string,
    register: string,
    status: SessionStatus = "active",
  ): Promise<Session | null> {
    const whereConditions = {
      ...(sessionId && { id: sessionId }),
      isActive: status === "all" ? undefined : status === "active",
    };
    return this.repository.findOne({
      where: {
          id: sessionId,
          account: {
            user: {
              register
            }
          },
          ...whereConditions,
        },
      relations: {
        account: {
          user: true
        }
      },
      order: {
        createdAt: "ASC",
      },
    });
  }

  async update(sessionId: string, register: string, session: Partial<Session>) {
    return this.repository.update(
      {
        id: sessionId,
        account: {
          user: {
            register,
          },
        },
      },
      {
        ...session,
      },
    );
  }

  async create(accountId: string, expiresAt: Date) {
    return this.repository.save({
      createdAt: new Date(),
      isActive: true,
      account: {
        id: accountId
      },
      expiresAt,
    });
  }
}
