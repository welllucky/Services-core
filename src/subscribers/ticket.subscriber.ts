// import { Ticket } from "@/entities";
// import {
//   EntitySubscriberInterface,
//   EventSubscriber,
//   InsertEvent,
//   RemoveEvent,
//   SoftRemoveEvent,
//   UpdateEvent,
// } from "typeorm";

// @EventSubscriber()
// export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
//   listenTo() {
//     return Ticket;
//   }

//   beforeInsert(event: InsertEvent<Ticket>) {
//     event.entity.createdAt = new Date();
//     event.entity.status = "notStarted";
//   }

//   beforeUpdate(event: UpdateEvent<Ticket>): Promise<Ticket> | void {
//     event.entity.updatedAt = new Date();
//   }

//   beforeRemove(event: RemoveEvent<Ticket>): Promise<Ticket> | void {
//     event.entity.closedAt = new Date();
//     event.entity.closedBy = event.queryRunner.data.resolverId;
//     event.entity.status = "closed";
//   }

//   beforeSoftRemove(event: SoftRemoveEvent<Ticket>): Promise<Ticket> | void {
//     event.entity.closedAt = new Date();
//     event.entity.closedBy = event.queryRunner.data.resolverId;
//     event.entity.status = "closed";
//   }
// }
