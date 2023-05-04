import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { ItemModule } from 'src/item/item.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule, UserModule, ItemModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
