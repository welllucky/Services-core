import {
    IResponseFormat,
    ITicket,
    Pagination,
    PublicTicketDto,
    SearchedTicketDto,
    UpdateTicketDto,
} from "@/typing";
import { getUserDataByToken } from "@/utils";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { response } from "express";
import { UserModel } from "../user";
import { TicketRepository } from "./ticket.repository";

@Injectable()
export class TicketService {
    constructor(
        private readonly repository: TicketRepository,
        private readonly userModel: UserModel,
    ) {}

    async getAll(
        token: string,
        isSolver?: boolean,
        pagination?: Pagination,
    ): Promise<IResponseFormat<PublicTicketDto[]>> {
        await this.userModel.init({
            accessToken: token,
        });

        // if (!this.userModel.exists()) {
        //   throw new HttpException(
        //     {
        //       title: "Access denied",
        //       message: "User cannot find tickets without being logged in.",
        //     },
        //     HttpStatus.UNAUTHORIZED,
        //   );
        // }

        const tickets = await this.repository.findAll({
            userId: this.userModel.getRegister(),
            pagination,
            isSolver: isSolver,
        });

        if (!tickets.length) {
            throw new HttpException(undefined, HttpStatus.NO_CONTENT);
        }

        return {
            data: tickets.map(
                (ticket) =>
                    new PublicTicketDto(
                        ticket.id,
                        ticket.resume,
                        ticket.description,
                        ticket.date,
                        ticket.priority,
                        ticket.type,
                        ticket.status,
                        ticket?.resolver?.register,
                        // ticket.events,
                        ticket.createdAt,
                        ticket?.closedAt,
                        ticket.createdBy.register,
                        ticket?.closedBy?.register,
                    ),
            ),
            message: "Tickets found successfully",
        };
    }

    async getById(
        token: string,
        ticketId: string,
        isSolver?: boolean,
    ): Promise<IResponseFormat<PublicTicketDto>> {
        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "Access denied",
                    message:
                        "User cannot create an event without being logged in.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const ticket = await this.repository.findById(
            userId,
            ticketId,
            isSolver,
        );

        if (!ticket) {
            throw new HttpException("", HttpStatus.NO_CONTENT);
        }

        return {
            data: new PublicTicketDto(
                ticket.id,
                ticket.resume,
                ticket.description,
                ticket.date,
                ticket.priority,
                ticket.type,
                ticket.status,
                ticket.resolver?.register,
                // ticket.events,
                ticket.createdAt,
                ticket.closedAt,
                ticket.createdBy?.register,
                ticket.closedBy?.register,
            ),
            message: `Ticket ${ticketId} was found`,
        };
    }

    async update(token: string, ticketId: string, data: UpdateTicketDto) {
        if (Object.keys(data).length === 0) {
            throw new HttpException(
                {
                    title: "No update values provided",
                    message: "No values provided to update the ticket",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "Access denied",
                    message:
                        "User cannot create an event without being logged in.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const { isUpdated } = await this.repository.update(
            data,
            ticketId,
            userId,
        );

        if (!isUpdated) {
            throw new HttpException(
                {
                    title: "Ticket not updated",
                    message: "Occurred an error while updating the ticket",
                },
                HttpStatus.NOT_MODIFIED,
            );
        }

        return response.status(HttpStatus.NO_CONTENT);
    }

    async findInProgress(
        token: string,
        pagination?: Pagination,
    ): Promise<IResponseFormat<unknown>> {
        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "Access denied",
                    message:
                        "User cannot find tickets without being logged in.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const tickets = await this.repository.findAll({
            userId,
            filters: {
                status: "inProgress",
            },
            pagination,
        });

        if (!tickets.length) {
            throw new HttpException(
                {
                    title: "Tickets not found",
                    message: "No tickets found for the resolver",
                },
                HttpStatus.NO_CONTENT,
            );
        }

        return {
            data: tickets.map(
                (ticket) =>
                    new PublicTicketDto(
                        ticket.id,
                        ticket.resume,
                        ticket.description,
                        ticket.date,
                        ticket.priority,
                        ticket.type,
                        ticket.status,
                        ticket?.resolver?.register,
                        // ticket.events,
                        ticket.createdAt,
                        ticket?.closedAt,
                        ticket?.createdBy?.register,
                        ticket?.closedBy?.register,
                    ),
            ),
            message: `${tickets.length} tickets in progress was founded`,
        };
    }

    async create(
        token: string,
        ticketData: Omit<
            ITicket,
            "id" | "createdAt" | "updatedAt" | "closedAt"
        >,
    ): Promise<IResponseFormat<PublicTicketDto>> {
        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "Access denied",
                    message:
                        "User cannot create a ticket without being logged in.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const ticket = await this.repository.create(
            ticketData,
            this.userModel.getEntity(),
        );

        if (!ticket) {
            throw new HttpException(
                {
                    title: "Ticket not created",
                    message: "Occurred an error while creating the ticket",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return {
            data: new PublicTicketDto(
                ticket.id,
                ticket.resume,
                ticket.description,
                ticket.date,
                ticket.priority,
                ticket.type,
                ticket.status,
                ticket.resolver?.register,
                // ticket.events,
                ticket?.createdAt,
                ticket?.closedAt,
                ticket.createdBy.register,
                ticket.closedBy?.register,
            ),
            message: "Ticket created successfully",
        };
    }

    async start(
        token: string,
        ticketId: string,
    ): Promise<IResponseFormat<unknown>> {
        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "Access denied",
                    message:
                        "The ticket cannot be started without being logged in.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const { isUpdated } = await this.repository.update(
            {
                status: "inProgress",
                updatedAt: new Date(),
            },
            ticketId,
            userId,
        );

        if (!isUpdated) {
            throw new HttpException(
                {
                    title: "Ticket not started",
                    message: "Occurred an error while starting the ticket",
                },
                HttpStatus.NOT_MODIFIED,
            );
        }

        return {
            title: "Ticket started",
            message: `The ticket ${ticketId} was started successfully`,
        };
    }

    async close(
        token: string,
        ticketId: string,
    ): Promise<IResponseFormat<unknown>> {
        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "Access denied",
                    message:
                        "The ticket cannot be closed without being logged in.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
        const { isUpdated } = await this.repository.update(
            {
                status: "closed",
            },
            ticketId,
            userId,
            true,
        );
        if (!isUpdated) {
            throw new HttpException(
                {
                    title: "Ticket not closed",
                    message: "Occurred an error while closing the ticket",
                },
                HttpStatus.NOT_MODIFIED,
            );
        }
        return {
            title: "Ticket closed",
            message: `The ticket ${ticketId} was closed successfully. The resolver will be notified!`,
        };
    }

    async resolve(
        token: string,
        ticketId: string,
    ): Promise<IResponseFormat<unknown>> {
        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "Access denied",
                    message:
                        "The ticket cannot be resolved without being logged in.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const { isUpdated } = await this.repository.update(
            {
                status: "closed",
            },
            ticketId,
            userId,
            true,
        );

        if (!isUpdated) {
            throw new HttpException(
                {
                    title: "Ticket not resolved",
                    message: "Occurred an error while resolving the ticket",
                },
                HttpStatus.NOT_MODIFIED,
            );
        }

        return {
            title: "Ticket resolved",
            message: `The ticket ${ticketId} was resolved successfully. The user will be notified!`,
        };
    }

    async search(
        token: string,
        term: string,
    ): Promise<IResponseFormat<unknown>> {
        const { userData } = await getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!this.userModel.exists()) {
            throw new HttpException(
                {
                    title: "User provided is not valid",
                    message:
                        "User not found or not exists, please check the credentials.",
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const tickets = await this.repository.findAnyIssueByIdOrName(
            userId,
            term,
        );

        if (!tickets.length) {
            throw new HttpException(
                {
                    title: "Tickets not found",
                    message: `No tickets found with the provided search term: ${term}.`,
                },
                HttpStatus.NO_CONTENT,
            );
        }

        return {
            data: tickets.map(
                (ticket) =>
                    new SearchedTicketDto(
                        ticket.id,
                        ticket.resume,
                        ticket.description,
                        ticket.date,
                        ticket.priority,
                        ticket.type,
                        ticket.status,
                        ticket.createdBy?.register,
                        ticket?.resolver?.register,
                    ),
            ),
            message: `${tickets.length} tickets found with the term: ${term}.`,
        };
    }
}
