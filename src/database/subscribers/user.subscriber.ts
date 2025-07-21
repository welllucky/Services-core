import { User } from "@/database/entities";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from "typeorm";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    if (event.entity) {
      event.entity.createdAt = new Date();
    }
  }

  beforeUpdate(event: UpdateEvent<User>): Promise<User> | void {
    if (event.entity) {
      event.entity.updatedAt = new Date();
    }
  }

  private setDeletedAt(entity: User | undefined): void {
    if (entity) {
      entity.deletedAt = new Date();
    }
  }

  beforeRemove(event: RemoveEvent<User>): Promise<User> | void {
    this.setDeletedAt(event.entity);
  }

  beforeSoftRemove(event: SoftRemoveEvent<User>): Promise<User> | void {
    this.setDeletedAt(event.entity);
  }
}
