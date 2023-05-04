import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { AuthModule } from './auth/auth.module';
import { TransferModule } from './transfer/transfer.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';

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
