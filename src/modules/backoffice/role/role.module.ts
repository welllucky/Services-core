import { UserModule } from '@/modules/core/user';
import { AccountModule } from '@/modules/access/account';
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    UserModule,
    AccountModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
