import {
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
    private readonly repository: SessionRepository,
    private readonly model: SessionModel,
    private readonly userModel: UserModel,
  ) {}

  async create(
    credentials: GetSessionDTO,
  ): Promise<IResponseFormat<SessionInfoDTO>> {
    if (!credentials.email || !credentials.password) {
      const fieldsEmptyMessage = `${!credentials.email ? "Email" : ""}${!credentials.email && !credentials.password ? " and " : ""}${!credentials.password ? "Password" : ""} is empty.`;

      addBreadcrumb({
        category: "api",
        level: "warning",
        message: fieldsEmptyMessage,
        data: {
          isEmailEmpty: !credentials.email,
          isPasswordEmpty: !credentials.password,
        },
      });

      throw new HttpException(
        {
          title: fieldsEmptyMessage,
          message: `${fieldsEmptyMessage} Please fill all fields.`,
        },
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

    if (!userId) {
      addBreadcrumb({
        category: "api",
        level: "log",
        message: "User not exist",
        data: {
          email: credentials.email,
        },
      });

      throw new NotFoundException(
        {
          title: "User not found",
          message:
            "User not found. Maybe the email is wrong or not was registered.",
        },
        {
          description:
            "User not found. Maybe the email is wrong or not exists.",
        },
      );
    }

    const actualSession = await this.repository.find(userId);

    if (actualSession?.isActive) {
      const closedSession = await this.update(
        {
          isActive: false,
        },
        actualSession.id,
        userId,
        true,
      );

      if (!closedSession?.message) {
        throw new HttpException(
          {
            title: "Active Session not closed",
            message:
              "Exist a session already active and could not be closed. Please try again later",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const { accessToken, expiresAt } = await this.model.createAccessToken({
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
    safe = false,
  ): Promise<IResponseFormat<SessionDTO>> {
    await this.model.init(sessionId, register);

    const isSessionValid = await this.model.isValid();

    if (!isSessionValid)
      throw new HttpException(
        {
          title: "Session not found",
          message: "Session not found or is not valid",
        },
        HttpStatus.BAD_REQUEST,
      );

    const updatedSession = await this.repository.update(
      session,
      sessionId,
      this.model.session.user.id,
    );

    if (!updatedSession?.affected) {
      if (!safe) {
        throw new HttpException(
          {
            title: "Session not updated",
            message:
              "Occurred an error while updating the session, please try again later",
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: "",
        error: {
          title: "Session not updated",
          message:
            "Occurred an error while updating the session, please try again later",
        },
      };
    }

    return {
      message: "Session updated successfully",
    };
  }

  async close(token: string) {
    const { userData } = await getUserByToken(token);
    const userId = userData?.register;

    if (!userId) {
      throw new HttpException(
        {
          title: "User provided is not valid",
          message:
            "User not found or not exists, please check the credentials.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const actualSession = await this.find(userId, undefined, "active", true);

    if (!actualSession) {
      throw new HttpException(
        {
          title: "Session not found",
          message: "Active session not found",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.model.init(actualSession.id, userId);

    const isSessionValid = await this.model.isValid();
    const sessionId = this.model.session.id;

    if (!isSessionValid) {
      return response.status(204);
    }

    const updatedSession = await this.update(
      {
        isActive: false,
      },
      sessionId,
      userId,
    );

    if (!updatedSession?.message) {
      throw new HttpException(
        {
          title: "Session not updated",
          message:
            "Occurred an error while updating the session, please try again later",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return response.status(204);
  }

  async find(
    userId: string,
    sessionId?: string,
    status: SessionStatus = "active",
    safe = false,
  ) {
    if (!userId) {
      throw new HttpException(
        {
          title: "UserId was not provided",
          message: "UserId was not provided, please inform the user id.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const session = await this.repository.find(userId, sessionId, status);

    if (!session && !safe) {
      throw new HttpException(
        {
          title: "Session not found",
          message: "Session not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return session;
  }

  async findAll(token: string, status: SessionStatus = "active", safe = false) {
    const { userData } = await getUserByToken(token);
    const actualSession = await this.find(userData.register);

    const { register } = userData;

    if (!actualSession || !actualSession.isActive) {
      throw new HttpException(
        "User could not access this resource",
        HttpStatus.FORBIDDEN,
      );
    }

    const sessions = this.repository.findAll(register, status);

    if (!sessions && !safe) {
      throw new HttpException(
        {
          title: "Sessions not found",
          message: "Sessions not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return sessions;
  }
}
