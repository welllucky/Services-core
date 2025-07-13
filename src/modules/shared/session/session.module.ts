import { Session } from "@/database/entities";
import { SessionModel } from "@/models/session.model";
import { SessionRepository } from "@/repositories/session.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { SessionService } from "./session.service";

@Module({
    imports: [TypeOrmModule.forFeature([Session]), UserModule],
    providers: [SessionService, SessionRepository, SessionModel],
    exports: [SessionService, SessionRepository, SessionModel],
})
export class SessionModule {}