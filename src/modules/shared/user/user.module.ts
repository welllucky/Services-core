import { User } from "@/database/entities";
import { UserModel } from "@/models/user.model";
import { UserRepository } from "@/repositories/user.repository";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedPositionModule } from "../position/position.module";
import { SharedSectorModule } from "../sector/sector.module";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => SharedPositionModule),
        forwardRef(() => SharedSectorModule),
    ],
    providers: [UserService, UserRepository, UserModel],
    exports: [UserService, UserRepository, UserModel],
})
export class SharedUserModule {}