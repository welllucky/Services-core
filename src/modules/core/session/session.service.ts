import { SessionModel } from "@/models/session.model";
import { UserModel } from "@/models/user.model";
import {
    GetSessionDTO,
    IResponseFormat,
    Pagination,
    SessionCredentialDTO,
    SessionDTO,
    SessionInfoDto,
    SessionStatus,
} from "@/typing";
import { getUserDataByToken } from "@/utils";
import {
    HttpException,
    HttpStatus,
    Injectable
} from "@nestjs/common";
import { addBreadcrumb } from "@sentry/nestjs";
import { response } from "express";
import { SessionRepository } from "./session.repository";

@Injectable()
export class SessionService {
    constructor(
        private readonly repository: SessionRepository,
        private readonly userModel: UserModel,
    ) {}

    async create(
        credentials: GetSessionDTO,
    ): Promise<IResponseFormat<SessionCredentialDTO>> {
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

        const userId = this.userModel.getData()?.id;

        // if (!userId) {
        //     addBreadcrumb({
        //         category: "api",
        //         level: "log",
        //         message: "User not exist",
        //         data: {
        //             email: credentials.email,
        //         },
        //     });

        //     throw new NotFoundException(
        //         {
        //             title: "User not found",
        //             message:
        //                 "User not found. Maybe the email is wrong or not was registered.",
        //         },
        //         {
        //             description:
        //                 "User not found. Maybe the email is wrong or not exists.",
        //         },
        //     );
        // }

        const actualSession = new SessionModel(this.repository, this.userModel);

        await actualSession.find({ status: "active" });

        if (actualSession.session?.isActive) {
            const closedSession = await this.repository.update(
                {
                    isActive: false,
                },
                actualSession.session.id,
                userId,
            );

            if (!closedSession?.affected) {
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

        const newSession = new SessionModel(this.repository, this.userModel);

        const { accessToken, expiresAt } = await newSession.createAccessToken({
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
            session.session.user.id,
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
        const { userData } = getUserDataByToken(token);
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
        const sessionId = session.session.id;

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
    ): Promise<Omit<SessionDTO, "token">> {
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
        token: string,
        pagination?: Pagination,
        status: SessionStatus = "active",
        safe = false,
    ): Promise<IResponseFormat<SessionInfoDto[]>> {
        const { userData } = getUserDataByToken(token);
        const actualSession = await this.find(
            userData?.register,
            undefined,
            "active",
            true,
        );

        const { register } = userData;

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
