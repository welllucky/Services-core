import { Session } from "@/entities";
import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from "typeorm";

@EventSubscriber()
export class SessionSubscriber implements EntitySubscriberInterface<Session> {
    listenTo() {
        return Session;
    }

    beforeInsert(event: InsertEvent<Session>) {
        event.entity.createdAt = new Date();
    }
}
