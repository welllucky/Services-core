import { User } from "@/entities";
import { UniqueEmailValidator, UniqueRegisterValidator } from "@/utils";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { RoleRepository } from "../role/role.repository";
// import { RoleService } from "../role/role.service";
import { RoleModule } from "../role";
import { SectorModule } from "../sector";
import { UserController } from "./user.controller";
import { UserModel } from "./user.model";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), SectorModule, RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserModel,
    UniqueRegisterValidator,
    UniqueEmailValidator,
  ],
  exports: [UserModel, UserService, UserRepository],
})
export class UserModule {}
