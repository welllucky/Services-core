import { Module } from "@nestjs/common";
import { SessionModule as SharedSessionModule } from "@/modules/shared/session";
import { UserModule } from "../user/user.module";

@Module({
    imports: [SharedSessionModule, UserModule],
    controllers: [],
})
export class SessionModule {}
