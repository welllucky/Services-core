import {
  AccessTokenDTO,
  GetSessionDTO,
  IResponseFormat,
  SessionDTO,
  SessionInfoDTO,
  SessionStatus,
} from "@/typing";
import { getUserByToken } from "@/utils";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { addBreadcrumb } from "@sentry/nestjs";
import { response } from "express";
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

  async create(
    credentials: GetSessionDTO,
  ): Promise<IResponseFormat<SessionInfoDTO>> {
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

      throw new HttpException(
        "Email or Password is empty.",
        HttpStatus.BAD_REQUEST,
      );
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

    const userId = this.userModel.getData()?.register;

    if (!this.userModel.exists()) {
      addBreadcrumb({
        category: "api",
        level: "log",
        message: "User not exist",
        data: {
          email: credentials.email,
        },
      });
      throw new NotFoundException("User not found", {
        description: "User not found. Maybe the email is wrong or not exists.",
      });
    }

    const actualSession = await this.sessionRepository.find(userId);

    if (actualSession && actualSession.isActive) {
      await this.update(
        {
          isActive: false,
        },
        actualSession.id,
        userId,
      );
    }

    const { accessToken, expiresAt } =
      await this.sessionModel.createAccessToken({
        password: credentials.password,
      });

    return {
      message: "Session created",
      data: {
        token: accessToken,
        expiresAt,
      },
    };
  }

  async update(
    session: Partial<SessionDTO>,
    sessionId: string,
    register: string,
  ) {
    await this.sessionModel.init(sessionId, register);

    const isSessionValid = await this.sessionModel.isValid();

    if (!isSessionValid)
      throw new HttpException("Session is not valid", HttpStatus.BAD_REQUEST);

    await this.sessionRepository.update(
      session,
      sessionId,
      this.sessionModel.session.user.id,
    );

    return {
      message: "Session updated successfully",
    };
  }

  async close(token: AccessTokenDTO) {
    const { userData } = await getUserByToken(String(token));
    const userId = userData?.register;

    if (!userId) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const actualSession = await this.find(userId);

    if (!actualSession) {
      throw new HttpException(
        "Don't exist an active session",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.sessionModel.init(actualSession.id, userId);

    const isSessionValid = await this.sessionModel.isValid();
    const sessionId = this.sessionModel.session.id;

    if (!isSessionValid) {
      throw new HttpException("Session is not valid", HttpStatus.BAD_REQUEST);
    }

    await this.update(
      {
        isActive: false,
      },
      sessionId,
      userId,
    );

    return response.status(204);
  }

  async find(
    userId: string,
    sessionId?: string,
    status: SessionStatus = "active",
  ) {
    const session = await this.sessionRepository.find(
      userId,
      sessionId,
      status,
    );
    if (session) {
      return session;
    } else {
      throw new HttpException("Session not found", HttpStatus.NOT_FOUND);
    }
  }

  async findAll(token: string, status: SessionStatus = "active") {
    const { userData } = await getUserByToken(token);
    const actualSession = await this.find(userData.register);

    const { register } = userData;

    if (!actualSession || !actualSession.isActive) {
      throw new HttpException(
        "User could not access this resource",
        HttpStatus.FORBIDDEN,
      );
    }

    return this.sessionRepository.findAll(register, status);
  }
}
