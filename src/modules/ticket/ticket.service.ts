import { IResponseFormat, ITicket } from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { response } from "express";
import { UserModel } from "../user";
import { TicketRepository } from "./ticket.repository";

@Injectable()
class TicketServices {
  constructor(
    private readonly repository: TicketRepository,
    private readonly userModel: UserModel,
  ) {}

  async create(
    userId: string,
    ticketData: Omit<ITicket, "id" | "createdAt" | "updatedAt" | "closedAt">,
  ): Promise<IResponseFormat<unknown>> {
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

    const ticket = await this.repository.create(userId, ticketData);

    if (!ticket) {
      throw new HttpException(
        {
          title: "Ticket not created",
          message: "Occurred an error while creating the ticket",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { data: ticket, message: "Ticket created successfully" };
  }

  async getAll(userId: string): Promise<IResponseFormat<unknown>> {
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

    return { data: tickets, message: `${tickets.length} was founded` };
  }

  async getById(
    userId: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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

    return { data: ticket, message: `Ticket ${ticketId} was found` };
  }

  async update(userId: string, ticketId: string, data: Partial<ITicket>) {
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

  async findInProgress(userId: string): Promise<IResponseFormat<unknown>> {
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
      data: tickets,
      message: `${tickets.length} tickets in progress was founded`,
    };
  }

  async start(
    userId: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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
    userId: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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
    userId: string,
    ticketId: string,
  ): Promise<IResponseFormat<unknown>> {
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
}

export { TicketServices };
