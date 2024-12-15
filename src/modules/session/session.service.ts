import { ISignIn, SessionDTo, SessionStatus } from "@/typing";
import { Injectable } from "@nestjs/common";
import { addBreadcrumb } from "@sentry/nestjs";
import { UserModel } from "../user/user.model";
import { SessionModel } from "./session.model";
import { SessionRepository } from "./session.repository";

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly sessionModel: SessionModel,
    private readonly userModel: UserModel,
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

      await this.userModel.init({
        email: credentials.email,
      });

      if (!this.userModel.exists({ safe: true })) {
        addBreadcrumb({
          category: "api",
          level: "log",
          message: "User not exist",
          data: {
            email: credentials.email,
          },
        });
        throw new Error("User not found");
      }

      addBreadcrumb({
        category: "api",
        level: "log",
        message: "User exist",
        data: {
          email: credentials.email,
        },
      });

      const actualSession = await this.find(this.userModel.getRegister());

      if (actualSession && actualSession.isActive) {
        await this.update(
          {
            isActive: false,
          },
          actualSession.id,
          this.userModel.getRegister(),
        );
      }

      const { accessToken, expiresAt } =
        await this.sessionModel.createAccessToken({
          password: credentials.password,
        });

      return {
        accessToken,
        expiresAt,
      };
    } catch (error) {
      console.log(error);
      throw new Error(`Access Token is not created out: ${error}`);
    }
  }

  async update(
    session: Partial<SessionDTo>,
    sessionId: string,
    register: string,
  ) {
    await this.sessionModel.init(sessionId, register);

    const isSessionValid = await this.sessionModel.isValid();

    if (!isSessionValid) throw new Error("Session is not valid");

    return await this.sessionRepository.update(
      session,
      sessionId,
      this.sessionModel.session.user.id,
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
    return this.sessionRepository.find(userId, sessionId, status);
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

    return this.sessionRepository.findAll(register, status);
  }
}
