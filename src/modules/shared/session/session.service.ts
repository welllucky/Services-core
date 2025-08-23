import { SessionModel, UserModel } from "@/models";
import { SessionRepository, UserRepository } from "@/repositories";
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
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { response } from "express";

@Injectable()
export class SessionService {
    constructor(
        private readonly repository: SessionRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async update(
        sessionData: Partial<SessionDTO>,
        sessionId: string,
        register: string,
        safe = false,
    ): Promise<IResponseFormat<SessionDTO>> {
        const user = new UserModel(this.userRepository);
        await user.init({ register });

        if (!user.exists()) {
            throw new NotFoundException(
                "User not found by register, please check the register.",
                );
            }

        const session = new SessionModel(this.repository, user);

        await session.init(sessionId);

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
            sessionId,
            register,
            sessionData,
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
        const userModel = new UserModel(this.userRepository);
        await userModel.init({ register: user.register });

        if (!userModel.exists()) {
            throw new NotFoundException(
                "User not found by register, please check the register.",
                );
            }

        if (!user.register) {
            throw new HttpException(
                {
                    title: "User provided is not valid",
                    message:
                        "User not found or not exists, please check the credentials.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const actualSession = await this.repository.findLastActiveByUserRegister(
            user.register,
        );

        if (!actualSession) {
            throw new BadRequestException(
                {
                    title: "Session not found",
                    message: "Active session not found",
                },
            );
        }

        const session = new SessionModel(this.repository, userModel);

        await session.init(actualSession.id);

        const isSessionValid = await session.isValid();
        const sessionId = session.session?.id;

        if (!isSessionValid || !sessionId) {
            throw new BadRequestException("Session not valid or not exists");
        }

        const updatedSession = await this.repository.update(
            sessionId,
            user.register,
            {
                isActive: false,
            },
        );

        if (!updatedSession?.affected) {
            throw new BadRequestException(
                "Occurred an error while updating the session, please try again later",
            );
        }

        return response.status(204);
    }

    async find(
        sessionId: string,
        register: string,
        status: SessionStatus = "active",
    ): Promise<Partial<Omit<SessionDTO, "token">>> {
        if (!register) {
            throw new HttpException(
                {
                    title: "UserId was not provided",
                    message:
                        "UserId was not provided, please inform the user id.",
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const session = await this.repository.find(sessionId, register, status);

        if (!session) {
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
            userId: session?.account?.user?.id,
        };
    }

    async findAll(
        user: UserWithSession,
        pagination?: Pagination,
        status: SessionStatus = "active",
    ): Promise<IResponseFormat<SessionInfoDto[]>> {
        if (!user?.register) {
            throw new BadRequestException({
                description: "User not found. Please check the credentials.",
            });
        }

        const sessions = await this.repository.findAll(
            user.register,
            status,
            pagination,
        );

        if (!sessions?.length) {
            throw new NotFoundException("Sessions not found");
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
