import { Session } from "@/entities";
import { ISignIn, SessionDTo, SessionStatus } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { addBreadcrumb } from "@sentry/nestjs";
import { Repository } from "typeorm";
// import { SessionModel } from "./session.model";
// import { UserModel } from "../user/user.model";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    // private readonly sessionModel: SessionModel,
    // private readonly userModel: UserModel,
  ) {}

  async create(credentials: ISignIn) {
    try {
      if (!credentials.email || !credentials.password) {
        addBreadcrumb({
          category: "api",
          level: "warning",
          message: "Email or Password is empty.",
          data: {
            isEmailEmpty: credentials.email === "",
            isPasswordEmpty: credentials.password === "",
          },
        });

        throw new Error("Email or Password is empty.");
      }

      addBreadcrumb({
        category: "api",
        level: "log",
        message: "Email and password received",
        data: {
          email: credentials.email,
          password: "***********",
        },
      });

      // this.userModel.init({
      //   email: credentials.email,
      // });

      // if (!this.userModel.exists({ safe: true })) {
      //   addBreadcrumb({
      //     category: "api",
      //     level: "log",
      //     message: "User not exist",
      //     data: {
      //       email: credentials.email,
      //     },
      //   });
      //   throw new Error("User not found");
      // }

      addBreadcrumb({
        category: "api",
        level: "log",
        message: "User exist",
        data: {
          email: credentials.email,
        },
      });

      // const actualSession = await this.find(this.userModel.getRegister());

      // if (actualSession && actualSession.isActive) {
      //   await this.update(
      //     {
      //       isActive: false,
      //     },
      //     actualSession.id,
      //     this.userModel.getRegister(),
      //   );
      // }

      // const { accessToken, expiresAt } =
      //   await this.sessionModel.createAccessToken({
      //     password: credentials.password,
      //   });

      // return {
      //   accessToken,
      //   expiresAt,
      // };
    } catch (error) {}
  }

  async update(
    session: Partial<SessionDTo>,
    sessionId: string,
    userId: string,
  ) {
    // this.userModel.init({
    //   register: userId,
    // });

    // await this.sessionModel.init(sessionId, userId);

    // const isSessionValid = await this.sessionModel.isValid();

    // if (!isSessionValid) throw new Error("Session is not valid");

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

  async close(sessionId: string, userId: string) {
    return await this.update(
      {
        isActive: false,
      },
      sessionId,
      userId,
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
