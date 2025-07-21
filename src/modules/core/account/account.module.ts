import { Account } from "@/database/entities";
import {
 SharedAccountModule
} from "@/modules/shared";
import { AccountRepository } from "@/repositories";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountController } from "./account.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Account]),
        SharedAccountModule,

    ],
    controllers: [AccountController],
    providers: [AccountRepository],
    exports: [AccountRepository],
})
export class AccountModule {}
