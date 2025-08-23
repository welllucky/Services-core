import { User } from "@/database/entities";
import { UserModel } from "@/models/user.model";
import { UserRepository } from "@/repositories/user.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ValidationModule } from "../validation/validation.module";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ValidationModule,
    ],
    providers: [UserService, UserRepository, UserModel],
    exports: [UserService, UserRepository, UserModel],
})
export class SharedUserModule {}