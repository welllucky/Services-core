import { User } from "@/entities";
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
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    beforeInsert(event: InsertEvent<User>) {
        const rootPassword = event.queryRunner.data?.rootPassword;

        const { hashedPassword } = encryptPassword(rootPassword);

        event.entity.hash = hashedPassword;
        event.entity.createdAt = new Date();
    }

    beforeUpdate(event: UpdateEvent<User>): Promise<User> | void {
        event.entity.updatedAt = new Date();
    }

    beforeRemove(event: RemoveEvent<User>): Promise<User> | void {
        event.entity.deletedAt = new Date();
    }

    beforeSoftRemove(event: SoftRemoveEvent<User>): Promise<User> | void {
        event.entity.deletedAt = new Date();
    }
}
