import { Account } from "@/database/entities";
import { AccountRepository } from "@/repositories";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountService } from "./account.service";
import { ValidationModule } from "../validation/validation.module";

@Module({
    imports: [TypeOrmModule.forFeature([Account]), ValidationModule],
    providers: [AccountService, AccountRepository],
    exports: [AccountService, AccountRepository],
})
export class SharedAccountModule {}
