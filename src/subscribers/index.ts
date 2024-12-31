import { SessionSubscriber } from "./session.subscriber";
// import { TicketSubscriber } from "./ticket.subscriber";
import { UserSubscriber } from "./user.subscriber";

export const subscribers = [UserSubscriber, SessionSubscriber];
