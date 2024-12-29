import { Event, Ticket, User } from "@/entities";
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

  findEventsByUserId(userId: string) {
    return this.repository.findBy({
      createdBy: {
        register: userId,
      },
    });
  }

  async createEvent(
    eventData: Omit<IEvent, "id" | "createdBy">,
    user: User,
    ticket?: Ticket,
  ) {
    return this.repository.create({
      ...eventData,
      ...(ticket && { ticket }),
      createdBy: user,
      createdAt: new Date(),
    });
  }

  findPublicEventsByTicketId(ticketId: string) {
    return this.repository.find({
      where: { ticket: { id: ticketId }, visibility: "public" },
    });
  }

  findAllEventsByTicketId(ticketId: string) {
    return this.repository.find({
      where: { ticket: { id: ticketId } },
    });
  }

  countEventsByTicketId(ticketId: string) {
    return this.repository.count({ where: { createdBy: { id: ticketId } } });
  }
}

export { EventRepository };
