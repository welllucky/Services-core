import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "src/entities";
import { SessionController } from "./session.controller";
import { SessionModel } from "./session.model";
import { SessionRepository } from "./session.repository";
import { SessionService } from "./session.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Session]), UserModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, SessionModel],
})
export class SessionModule {}
