import { User } from "@/entities";
import { UserModel } from "@/models";
import { UniqueEmailValidator, UniqueRegisterValidator } from "@/utils";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../../../repositories/user.repository";
import { PositionModule } from "../position/position.module";
import { SectorModule } from "../sector/sector.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => SectorModule),
        forwardRef(() => PositionModule)
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        UniqueRegisterValidator,
        UniqueEmailValidator,
        UserModel
    ],
    exports: [UserService, UserRepository, UserModel],
})
export class UserModule {}
