import { Session } from "@/database/entities";
import { SessionModel } from "@/models/session.model";
import { SessionRepository } from "@/modules/shared/session/session.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedUserModule } from "../user/user.module";
import { SessionService } from "./session.service";

@Module({
    imports: [TypeOrmModule.forFeature([Session]), SharedUserModule],
    providers: [SessionService, SessionRepository, SessionModel],
    exports: [SessionService, SessionRepository, SessionModel],
})
export class SharedSessionModule {}