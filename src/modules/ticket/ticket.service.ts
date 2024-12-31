import {
  IResponseFormat,
  ITicket,
  PublicTicket,
  UpdateTicketDto,
} from "@/typing";
import { getUserByToken } from "@/utils";
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

  async create(
    token: string,
    ticketData: Omit<ITicket, "id" | "createdAt" | "updatedAt" | "closedAt">,
  ): Promise<IResponseFormat<PublicTicket>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "User cannot create a ticket without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const ticket = await this.repository.create(this.userModel.getEntity(), {
      ...ticketData,
    });

    if (!ticket) {
      throw new HttpException(
        {
          title: "Ticket not created",
          message: "Occurred an error while creating the ticket",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log({ ticket });
    return {
      data: new PublicTicket(
        ticket.id,
        ticket.resume,
        ticket.description,
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

  async getAll(token: string): Promise<IResponseFormat<PublicTicket[]>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "User cannot find tickets without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tickets = await this.repository.findAll(userId);

    if (!tickets) {
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
          new PublicTicket(
            ticket.id,
            ticket.resume,
            ticket.description,
            ticket.priority,
            ticket.type,
            ticket.status,
            ticket.resolver.register,
            // ticket.events,
            ticket.createdAt,
            ticket.closedAt,
            ticket.createdBy.register,
            ticket.closedBy.register,
          ),
      ),
      message: "Tickets found successfully",
    };
  }

  async getById(
    token: string,
    ticketId: string,
  ): Promise<IResponseFormat<PublicTicket>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "User cannot create an event without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const ticket = await this.repository.findById(userId, ticketId);

    if (!ticket) {
      throw new HttpException(
        {
          title: "Ticket not found",
          message: `No ticket ${ticketId} found for the user`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: new PublicTicket(
        ticket.id,
        ticket.resume,
        ticket.description,
        ticket.priority,
        ticket.type,
        ticket.status,
        ticket.resolver.register,
        // ticket.events,
        ticket.createdAt,
        ticket.closedAt,
        ticket.createdBy.register,
        ticket.closedBy.register,
      ),
      message: `Ticket ${ticketId} was found`,
    };
  }

  async update(token: string, ticketId: string, data: UpdateTicketDto) {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "User cannot create an event without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { isUpdated } = await this.repository.update(userId, ticketId, data);

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

  async findInProgress(token: string): Promise<IResponseFormat<unknown>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "User cannot find tickets without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tickets = await this.repository.findAll(userId, {
      status: "inProgress",
    });

    if (!tickets) {
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
          new PublicTicket(
            ticket.id,
            ticket.resume,
            ticket.description,
            ticket.priority,
            ticket.type,
            ticket.status,
            ticket.resolver.register,
            // ticket.events,
            ticket.createdAt,
            ticket.closedAt,
            ticket.createdBy.register,
            ticket.closedBy.register,
          ),
      ),
      message: `${tickets.length} tickets in progress was founded`,
    };
  }

  async start(
    token: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "The ticket cannot be started without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const startedTicket = this.repository.update(userId, ticketId, {
      status: "inProgress",
      updatedAt: new Date(),
    });

    if (!startedTicket) {
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

  async resolve(
    token: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "The ticket cannot be resolved without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updatedTicket = await this.repository.updateByResolver(
      userId,
      ticketId,
      {
        status: "closed",
      },
    );

    if (!updatedTicket) {
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
      message: `The ticket ${ticketId} was resolved successfully. The resolver will be notified!`,
    };
  }

  async resolveByResolver(
    token: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "The ticket cannot be resolved without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updatedTicket = await this.repository.updateByResolver(
      userId,
      ticketId,
      {
        status: "closed",
      },
    );

    if (!updatedTicket) {
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

  async close(
    token: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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

    await this.userModel.init({
      register: userId,
    });

    if (!this.userModel.exists()) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "The ticket cannot be closed without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const updatedTicket = await this.repository.updateByResolver(
      userId,
      ticketId,
      {
        status: "closed",
      },
    );
    if (!updatedTicket) {
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
}
