import { Session } from "@/database/entities";
import { SessionRepository } from "@/repositories/session.repository";
import { SessionStatus } from "@/typing";
import { Injectable } from "@nestjs/common";
import { UserModel } from "./user.model";

@Injectable()
class SessionModel {
    public id!: string;

    public expiresAt!: Date;

    public createdAt!: Date;

    public session: Session | null;

    constructor(
        private readonly repository: SessionRepository,
        private readonly user: UserModel,
    ) {
        this.session = new Session();
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
