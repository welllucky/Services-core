import { Session } from "@/database/entities";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent
} from "typeorm";

@EventSubscriber()
export class SessionSubscriber implements EntitySubscriberInterface<Session> {
  listenTo() {
    return Session;
  }

  beforeInsert(event: InsertEvent<Session>) {
    event.entity.createdAt = new Date();
  }

  beforeUpdate(event: UpdateEvent<Session>): Promise<Session> | void {
    if (event.entity) {
      event.entity.updatedAt = new Date();
    }
  }
}
