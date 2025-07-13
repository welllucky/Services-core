import { User } from "@/database/entities";
import { UserModel } from "@/models/user.model";
import { UserRepository } from "@/repositories/user.repository";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionModule } from "../position/position.module";
import { SectorModule } from "../sector/sector.module";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => PositionModule),
        forwardRef(() => SectorModule),
    ],
    providers: [UserService, UserRepository, UserModel],
    exports: [UserService, UserRepository, UserModel],
})
export class UserModule {}