import { Session, User } from "@/entities";
import { SessionRepository } from "@/repositories/session.repository";
import { SessionStatus } from "@/typing";
import { createAccessToken } from "@/utils";
import { Injectable } from "@nestjs/common";
import { UserModel } from "./user.model";

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
                // lastConnection: userData?.lastConnection,
                isBanned: userData?.isBanned,
                canCreateTicket: userData?.canCreateTicket,
                canResolveTicket: userData?.canResolveTicket,
                position: userData?.position?.name,
                sector: userData?.sector?.name,
                role: userData?.role,
            };

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + daysToExpire);

            const accessToken = createAccessToken(
                tokenInfo,
                process.env.AUTH_SECRET ?? "",
                3,
            );

            this.session.expiresAt = expiresAt;
            this.session.isActive = true;
            this.session.user = this.user.getEntity() as User;

            await this.session.save();

            return { accessToken, expiresAt };
        } catch (error) {
            throw new Error(`Access Token is not created: ${error}`);
        }
    }

    public async close(sessionId?: string) {
        try {
            const session = await this.repository.find(
                this.user.Register() ?? "",
                sessionId ?? this.session?.id,
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
        const userId = this.user.Register();

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

    public async find({status, sessionId}: {status: SessionStatus, sessionId?: string}) {
        try {
            const register = this.user.Register();
            if (!register) {
                throw new Error("Register not found");
            }

            const session = await this.repository.find(register, sessionId, status);

            this.session = session;
        } catch (error) {
            throw new Error(`Session not found: ${error}`);
        }
    }

    public async isValid() {
        return this.session?.isActive && this.session.expiresAt > new Date();
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
