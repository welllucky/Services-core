import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities";
import { UserController } from "./user.controller";
import { UserModel } from "./user.model";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserModel],
  exports: [UserModel],
})
export class UserModule {}
