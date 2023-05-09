/*
| Developed by Starton
| Filename : app.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ItemModule } from './item/item.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransferModule } from './transfer/transfer.module';
import { UserModule } from './user/user.module';

/*
|--------------------------------------------------------------------------
| APP MODULE
|--------------------------------------------------------------------------
*/
@Module({
  imports: [
    UserModule,
    ItemModule,
    AuthModule,
    TransferModule,
    PrismaModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
