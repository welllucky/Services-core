import { User } from "@/entities";
import { encryptPassword } from "@/utils";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    const rootPassword = event.queryRunner.data?.rootPassword;

    const { hashedPassword } = encryptPassword(rootPassword);

    event.entity.hash = hashedPassword;
  }
}
