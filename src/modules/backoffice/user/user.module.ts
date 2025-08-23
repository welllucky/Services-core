import { UserModel } from "@/models";
import { SharedUserModule } from "@/modules/shared/user";
import { UniqueEmailValidator, UniqueRegisterValidator } from "@/utils";
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";

@Module({
    imports: [SharedUserModule],
    controllers: [UserController],
    providers: [
        UniqueRegisterValidator,
        UniqueEmailValidator,
        UserModel
    ],
    exports: [UserModel],
})
export class UserModule {}
