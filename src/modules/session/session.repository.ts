// user.repository.ts
import { Session } from "@/entities";
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
    userRegister: string,
    status: SessionStatus,
    pagination?: Pagination,
  ): Promise<Session[]> {
    const pageIndex =
      !pagination?.index || pagination?.index === 1 ? 0 : pagination?.index;
    const page = pagination?.page || 10;

    return this.repository.find({
      where: {
        user: {
          register: userRegister,
        },
        isActive: status === "all" ? undefined : status === "active",
      },
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
      take: page,
      skip: pageIndex * page,
    });
  }

  async find(
    userRegister: string,
    sessionId?: string,
    status: SessionStatus = "active",
  ): Promise<Session | null> {
    return this.repository.findOne({
      where: {
        user: {
          register: userRegister,
        },
        ...(sessionId && { id: sessionId }),
        isActive: status === "all" ? undefined : status === "active",
      },
      relations: ["user"],
      order: {
        createdAt: "ASC",
      },
    });
  }

  async update(session: Partial<Session>, sessionId: string, userId: string) {
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
}
