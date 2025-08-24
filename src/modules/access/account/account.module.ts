import { Account } from "@/database/entities";
import { AccountRepository } from "./account.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountService } from "./account.service";
import { ValidationModule } from "../../shared/validation/validation.module";
import { AccountController } from "./account.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Account]), ValidationModule],
    providers: [AccountService, AccountRepository],
    controllers: [AccountController],
    exports: [AccountService, AccountRepository],
})
export class AccountModule {}
