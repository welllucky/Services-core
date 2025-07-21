import { Account } from "@/database/entities";
import { encryptPassword } from "@/utils";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from "typeorm";

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  listenTo() {
    return Account;
  }

  beforeInsert(event: InsertEvent<Account>) {
    const rootPassword = event.queryRunner.data?.rootPassword;

    const { hashedPassword } = encryptPassword(rootPassword);

    if (event.entity) {
      event.entity.hash = hashedPassword;
      event.entity.createdAt = new Date();
    }
  }

  beforeUpdate(event: UpdateEvent<Account>): Promise<Account> | void {
    if (event.entity) {
      event.entity.updatedAt = new Date();
    }
  }

  private setDeletedAt(entity: Account | undefined): void {
    if (entity) {
      entity.deletedAt = new Date();
    }
  }

  beforeRemove(event: RemoveEvent<Account>): Promise<Account> | void {
    this.setDeletedAt(event.entity);
  }

  beforeSoftRemove(event: SoftRemoveEvent<Account>): Promise<Account> | void {
    this.setDeletedAt(event.entity);
  }
}
