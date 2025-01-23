import { Session } from "@/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { SessionController } from "./session.controller";
import { SessionModel } from "./session.model";
import { SessionRepository } from "./session.repository";
import { SessionService } from "./session.service";

@Module({
  imports: [TypeOrmModule.forFeature([Session]), UserModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, SessionModel],
  exports: [SessionService, SessionRepository, SessionModel],
})
export class SessionModule {}
