import { UserModel } from "@/models";
import { UniqueEmailValidator, UniqueRegisterValidator } from "@/utils";
import { forwardRef, Module } from "@nestjs/common";
import { SharedUserModule } from "@/modules/shared/user";
import { PositionModule } from "../position/position.module";
import { SectorModule } from "../sector/sector.module";
import { UserController } from "./user.controller";

@Module({
    imports: [
        SharedUserModule,
        forwardRef(() => SectorModule),
        forwardRef(() => PositionModule)
    ],
    controllers: [UserController],
    providers: [
        UniqueRegisterValidator,
        UniqueEmailValidator,
        UserModel
    ],
    exports: [UserModel],
})
export class UserModule {}
