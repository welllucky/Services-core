// user.repository.ts
import { Session } from "@/entities";
import { SessionStatus } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {}

  async findAll(register: string, status: SessionStatus): Promise<Session[]> {
    return this.repository.find({
      where: {
        user: {
          register,
        },
        isActive: status === "all" ? undefined : status === "active",
      },
      relations: ["user"],
      order: {
        createdAt: "ASC",
      },
    });
  }

  async find(
    userId: string,
    sessionId?: string,
    status: SessionStatus = "active",
  ): Promise<Session | null> {
    return this.repository.findOne({
      where: {
        user: {
          register: userId,
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
