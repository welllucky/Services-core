import { Module } from "@nestjs/common";
import { SharedUserModule } from "@/modules/shared/user";
import { UserController } from "./user.controller";

@Module({
    imports: [SharedUserModule],
    controllers: [UserController],
    exports: [SharedUserModule],
})
export class UserModule {}
