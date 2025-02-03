import {
  Event,
  // Ticket,
  User,
} from "@/entities";
import { IEvent } from "@/typing";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
class EventRepository {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  findEventById(eventId: string) {
    return this.repository.findOneBy({
      id: eventId,
    });
  }

  findAllByUserId(userId: string) {
    return this.repository.findBy({
      createdBy: {
        register: userId,
      },
    });
  }

  async createEvent(
    eventData: Omit<IEvent, "id" | "createdBy">,
    user: User,
    ticketId?: string,
    // ticket?: Ticket,
  ) {
    return this.repository.create({
      ...eventData,
      ...(ticketId && {
        ticket: {
          id: ticketId,
        },
      }),
      createdBy: user,
      createdAt: new Date(),
    });
  }

  findAllByTicketId(
    ticketId: string,
    visibility: "public" | "private" | "all" = "public",
  ) {
    return this.repository.find({
      where: {
        ticket: { id: ticketId },
        visibility:
          visibility === "all"
            ? undefined
            : visibility === "private"
              ? "private"
              : "public",
      },
      order: {
        createdAt: "ASC",
      },
    });
  }
}

export { EventRepository };
