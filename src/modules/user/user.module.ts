import { User } from "@/entities";
import { UniqueEmailValidator, UniqueRegisterValidator } from "@/utils";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserModel } from "./user.model";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserModel,
    UniqueRegisterValidator,
    UniqueEmailValidator,
  ],
  exports: [UserModel],
})
export class UserModule {}
