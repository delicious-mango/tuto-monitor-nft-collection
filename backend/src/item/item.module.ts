import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
