import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
