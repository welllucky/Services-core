import { SessionModel } from "@/models/session.model";
import { UserModel } from "@/models/user.model";
import { SessionRepository } from "@/repositories/session.repository";
import {
    IResponseFormat,
    Pagination,
    SessionDTO,
    SessionInfoDto,
    SessionStatus,
    UserWithSession
} from "@/typing";
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable
} from "@nestjs/common";
import { response } from "express";

@Injectable()
export class SessionService {
    constructor(
        private readonly repository: SessionRepository,
        private readonly userModel: UserModel,
    ) {}

    async update(
        sessionData: Partial<SessionDTO>,
        sessionId: string,
        register: string,
        safe = false,
    ): Promise<IResponseFormat<SessionDTO>> {
        const session = new SessionModel(this.repository, this.userModel);

        await session.init(sessionId, register);

        const isSessionValid = await session.isValid();

        if (!isSessionValid)
            throw new HttpException(
                {
                    title: "Session not found",
                    message: "Session not found or is not valid",
                },
                HttpStatus.BAD_REQUEST,
            );

        const updatedSession = await this.repository.update(
            sessionData,
            sessionId,
            register,
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

    async close(user: UserWithSession) {
        const userId = user.id;

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

        const actualSession = await this.repository.find(
            userId,
            undefined,
            "active",
        );

        if (!actualSession) {
            throw new HttpException(
                {
                    title: "Session not found",
                    message: "Active session not found",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const session = new SessionModel(this.repository, this.userModel);

        await session.init(actualSession.id, userId);

        const isSessionValid = await session.isValid();
        const sessionId = session.session?.id;

        if (!isSessionValid || !sessionId) {
            throw new BadRequestException("Session not valid or not exists");
        }

        const updatedSession = await this.repository.update(
            {
                isActive: false,
            },
            sessionId,
            session.session?.user.id || "",
        );

        if (!updatedSession?.affected) {
            throw new BadRequestException(
                "Occurred an error while updating the session, please try again later",
            );
        }

        return response.status(204);
    }

    async find(
        userId: string,
        sessionId?: string,
        status: SessionStatus = "active",
        safe = false,
    ): Promise<Partial<Omit<SessionDTO, "token">>> {
        if (!userId) {
            throw new HttpException(
                {
                    title: "UserId was not provided",
                    message:
                        "UserId was not provided, please inform the user id.",
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

        return {
            createdAt: session?.createdAt,
            expiresAt: session?.expiresAt,
            id: session?.id,
            isActive: session?.isActive,
            userId: session?.user?.register,
        };
    }

    async findAll(
        user: UserWithSession,
        pagination?: Pagination,
        status: SessionStatus = "active",
        safe = false,
    ): Promise<IResponseFormat<SessionInfoDto[]>> {
        if (!user?.register) {
            throw new BadRequestException({
                description: "User not found. Please check the credentials.",
            });
        }

        const actualSession = await this.find(
            user.register,
            undefined,
            "active",
            true,
        );

        const { register } = user;

        if (!actualSession?.isActive) {
            throw new HttpException(
                "User could not access this resource",
                !actualSession?.isActive
                    ? HttpStatus.FORBIDDEN
                    : HttpStatus.UNAUTHORIZED,
            );
        }

        const sessions = await this.repository.findAll(
            register,
            status,
            pagination,
        );

        if (!sessions?.length && !safe) {
            throw new HttpException(
                {
                    title: "Sessions not found",
                    message: "Sessions not found",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            data: sessions?.map(
                (session) =>
                    new SessionInfoDto(
                        session?.id,
                        session?.expiresAt,
                        session?.createdAt,
                        session?.isActive,
                    ),
            ),
            message: `${sessions?.length || 0} session(s) found`,
        };
    }
}
