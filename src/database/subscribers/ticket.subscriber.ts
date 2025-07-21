import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
    SoftRemoveEvent,
    UpdateEvent,
} from "typeorm";
import { Ticket } from "../entities";

@EventSubscriber()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
    listenTo() {
        return Ticket;
    }

    beforeInsert(event: InsertEvent<Ticket>) {
        event.entity.createdAt = new Date();
        event.entity.status = "notStarted";
    }

    beforeUpdate(event: UpdateEvent<Ticket>): Promise<Ticket> | void {
        if (event.entity) {
            event.entity.updatedAt = new Date();
        }
    }

    beforeRemove(event: RemoveEvent<Ticket>): Promise<Ticket> | void {
        if (event.entity) {
            event.entity.closedAt = new Date();
        }
    }

    beforeSoftRemove(event: SoftRemoveEvent<Ticket>): Promise<Ticket> | void {
        if (event.entity) {
            event.entity.closedAt = new Date();
        }
    }
}
