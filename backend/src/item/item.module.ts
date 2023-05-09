/*
| Developed by Starton
| Filename : item.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';

/*
|--------------------------------------------------------------------------
| ITEM MODULE
|--------------------------------------------------------------------------
*/
@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
