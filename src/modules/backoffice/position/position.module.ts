import { forwardRef, Module } from "@nestjs/common";
import { SharedPositionModule } from "@/modules/shared/position";
import { PositionController } from "./position.controller";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        SharedPositionModule,
        forwardRef(() => UserModule)
    ],
    controllers: [PositionController],
})
export class PositionModule {}
