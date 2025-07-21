import { forwardRef, Module } from "@nestjs/common";
import { SharedPositionModule } from "@/modules/shared/position";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        SharedPositionModule,
        forwardRef(() => UserModule)
    ],
})
export class PositionModule {}
