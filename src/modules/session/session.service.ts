import { Session, User } from "@/entities";
import { SessionDTo, SessionStatus } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(session: SessionDTo, user: User) {
    await this.sessionRepository.save({
      ...session,
      isActive: true,
      createdAt: new Date(),
      user,
    });
  }

  async update(
    session: Partial<SessionDTo>,
    sessionId: string,
    userId: string,
  ) {
    await this.sessionRepository.update(
      {
        id: sessionId,
        user: {
          register: userId,
        },
      },
      {
        ...session,
      },
    );
  }

  async find(
    userId: string,
    sessionId?: string,
    status: SessionStatus = "active",
  ) {
    return this.sessionRepository.findOne({
      where: {
        user: {
          register: userId,
        },
        ...(sessionId && { id: sessionId }),
        isActive: status === "all" ? undefined : status === "active",
      },
      order: {
        createdAt: "ASC",
      },
      relations: {
        user: true,
      },
    });
  }

  async findAll(
    // token: string,
    status: SessionStatus = "active",
  ) {
    // const { userData } = await getUserByToken(token);
    // const actualSession = await this.find(userData.register);

    // const { register } = userData;

    // if (!actualSession || !actualSession.isActive) {
    //   throw new Error("User could not access this resource");
    // }

    const register = "242424";

    return this.sessionRepository.find({
      where: {
        user: {
          register,
        },
        isActive: status === "all" ? undefined : status === "active",
      },
      order: {
        createdAt: "ASC",
      },
    });
  }
}
