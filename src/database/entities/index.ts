import { Account } from "./account.entity";
import { Event } from "./event.entity";
import { Position } from "./position.entity";
import { Sector } from "./sector.entity";
import { Session } from "./session.entity";
import { Ticket } from "./ticket.entity";
import { User } from "./user.entity";

export const entities = [Event, Position, Sector, Session, Ticket, User, Account];
export { Account, Event, Position, Sector, Session, Ticket, User };
