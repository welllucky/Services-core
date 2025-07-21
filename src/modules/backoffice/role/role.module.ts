import { UserModule } from '@/modules/core/user';
import { SharedAccountModule } from '@/modules/shared';
import { forwardRef, Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    SharedAccountModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
