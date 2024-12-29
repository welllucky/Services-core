import { UserModel } from "@/modules/user/user.model";
import { IEvent } from "@/typing";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SessionModel } from "../session/session.model";
import { EventRepository } from "./event.repository";

@Injectable()
export class EventServices {
  constructor(
    private readonly repository: EventRepository,
    private readonly sessionModel: SessionModel,
    private readonly userModel: UserModel,
  ) {}

  async createEvent(
    userId: string,
    ticketId: string,
    eventData: Omit<IEvent, "id" | "order" | "emitterId" | "createdBy">,
  ) {
    const eventsQuantity =
      await this.repository.countEventsByTicketId(ticketId);

    await this.userModel.init({
      register: userId,
    });

    const userExist = this.userModel.exists();

    if (!userExist) {
      throw new HttpException(
        {
          title: "Access denied",
          message: "User cannot create an event without being logged in.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.repository.createEvent(
      {
        ...eventData,
        order: eventsQuantity + 1,
      },
      this.userModel.getEntity(),
    );
  }

  async getEventById(eventId: string) {
    return this.repository.findEventById(eventId);
  }

  async getEventsByUserId(userId: string) {
    return this.repository.findEventsByUserId(userId);
  }

  async getEventsByTicketId(ticketId: string) {
    return this.repository.findAllEventsByTicketId(ticketId);
  }

  async getPublicEventsByTicketId(ticketId: string) {
    return this.repository.findPublicEventsByTicketId(ticketId);
  }
}
