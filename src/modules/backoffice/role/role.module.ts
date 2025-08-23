import { UserModule } from '@/modules/core/user';
import { SharedAccountModule } from '@/modules/shared';
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    UserModule,
    SharedAccountModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
