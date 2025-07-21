import { Account } from "@/database/entities";
import { AccountRepository } from "@/repositories";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedPositionModule } from "../position/position.module";
import { AccountService } from "./account.service";
import { SharedSectorModule } from "../sector/sector.module";

@Module({
    imports: [TypeOrmModule.forFeature([Account]), SharedPositionModule, SharedSectorModule],
    providers: [AccountService, AccountRepository],
    exports: [AccountService, AccountRepository],
})
export class SharedAccountModule {}
