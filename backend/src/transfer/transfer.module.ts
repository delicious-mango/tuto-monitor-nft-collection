import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { UserModule } from 'src/user/user.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [PrismaModule, EmailModule, UserModule, ItemModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
