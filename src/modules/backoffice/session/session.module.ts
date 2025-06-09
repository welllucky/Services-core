import { Session } from "@/entities";
import { SessionModel } from "@/models/session.model";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionRepository } from "../../../repositories/session.repository";
import { UserModule } from "../user/user.module";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";

@Module({
    imports: [TypeOrmModule.forFeature([Session]), UserModule],
    controllers: [SessionController],
    providers: [
        SessionService,
        SessionRepository,
        SessionModel,
    ],
    exports: [SessionService, SessionRepository, SessionModel],
})
export class SessionModule {}
