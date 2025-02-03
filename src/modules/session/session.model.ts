import { Session } from "@/entities";
import { createAccessToken } from "@/utils";
import { Injectable } from "@nestjs/common";
import { UserModel } from "../user/user.model";
import { SessionRepository } from "./session.repository";

@Injectable()
class SessionModel {
  public id!: string;

  public token!: string;

  public expiresAt!: Date;

  public createdAt!: Date;

  public session: Session | null;

  constructor(
    private readonly repository: SessionRepository,
    private readonly user: UserModel,
  ) {
    this.session = new Session();
  }

  public async createAccessToken({
    password,
    daysToExpire = 3,
  }: {
    password: string;
    daysToExpire?: number;
  }) {
    this.session = new Session();
    try {
      const isPasswordValid = await this.user.authUser(password);

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const userData = this.user.getData();

      const tokenInfo = {
        id: userData?.id,
        register: userData?.register,
        email: userData?.email,
        name: userData?.name,
        lastConnection: userData?.lastConnection,
        isBanned: userData?.isBanned,
        canCreateTicket: userData?.canCreateTicket,
        canResolveTicket: userData?.canResolveTicket,
        role: userData?.role,
        sector: userData?.sector,
      };

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToExpire);

      const accessToken = createAccessToken(
        tokenInfo,
        process.env.AUTH_SECRET,
        3,
      );

      this.session.expiresAt = expiresAt;
      this.session.isActive = true;
      this.session.user = this.user.getEntity();

      await this.session.save();

      return { accessToken, expiresAt };
    } catch (error) {
      throw new Error(`Access Token is not created: ${error}`);
    }
  }

  public async close(sessionId?: string) {
    try {
      const session = await this.repository.find(
        this.user.getRegister() ?? "",
        sessionId ?? this.session.id,
      );

      if (!session) {
        throw new Error("Session not found");
      }

      session.isActive = false;
      await session.save();
    } catch (error) {
      throw new Error(`Session not closed: ${error}`);
    }
  }

  public async closeOldSessions() {
    const userId = this.user.getRegister();

    if (!userId) {
      throw new Error("User not found");
    }

    this.repository.findAll(userId, "active").then((sessions) => {
      sessions.forEach(async (session) => {
        if (session.isActive) {
          await this.close(session.id);
        }
      });
    });
  }

  public async find() {
    try {
      const register = this.user.getRegister();
      if (!register) {
        throw new Error("Register not found");
      }

      const session = await this.repository.find(register);

      if (!session) {
        throw new Error();
      }

      this.session = session;
    } catch (error) {
      throw new Error(`Session not found: ${error}`);
    }
  }

  public async isValid() {
    if (
      !this.session ||
      !this.session.isActive ||
      this.session.expiresAt < new Date()
    ) {
      return false;
    }

    return true;
  }

  public async init(sessionId: string, userId: string) {
    this.session = null;
    this.session = await this.repository.find(userId, sessionId);

    if (!this.session) {
      throw new Error("Session not found");
    }
  }
}

export { SessionModel };
