import { Event } from "@/database/entities";
import { EventRepository } from "@/repositories/event.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventServices } from "./event.service";

@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    providers: [EventServices, EventRepository],
    exports: [EventServices, EventRepository],
})
export class EventModule {}