import { UserModel } from "@/models";
import { TicketRepository } from "@/repositories/ticket.repository";
import {
    IResponseFormat,
    Pagination,
    PublicTicketDto,
    SearchedTicketDto,
    UpdateTicketDto
} from "@/typing";
import { getUserDataByToken } from "@/utils";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { response } from "express";

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
            userId: this.userModel.Register() || "",
            pagination,
            isSolver,
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
                        ticket?.resolver?.register || null,
                        // ticket.events,
                        ticket.createdAt,
                        ticket?.closedAt,
                        ticket.createdBy.register,
                        ticket?.closedBy?.register || null,
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
        const { userData } = getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!userId || !this.userModel.exists()) {
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
                ticket.resolver?.register || null,
                // ticket.events,
                ticket.createdAt,
                ticket.closedAt,
                ticket.createdBy?.register,
                ticket.closedBy?.register || null,
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

        const { userData } = getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!userId || !this.userModel.exists()) {
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
        const { userData } = getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!userId || !this.userModel.exists()) {
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
                        ticket?.resolver?.register || null,
                        // ticket.events,
                        ticket.createdAt,
                        ticket?.closedAt,
                        ticket?.createdBy?.register,
                        ticket?.closedBy?.register || null,
                    ),
            ),
            message: `${tickets.length} tickets in progress was founded`,
        };
    }

    async resolve(
        token: string,
        ticketId: string,
    ): Promise<IResponseFormat<unknown>> {
        const { userData } = getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!userId || !this.userModel.exists()) {
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
        const { userData } = getUserDataByToken(token);
        const userId = userData?.register;

        await this.userModel.init({
            register: userId,
        });

        if (!userId || !this.userModel.exists()) {
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
                        ticket?.resolver?.register || null,
                    ),
            ),
            message: `${tickets.length} tickets found with the term: ${term}.`,
        };
    }
}
