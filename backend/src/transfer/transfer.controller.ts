import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransferSingle } from 'src/contracts/transfer-single/transfer-single.interface';
import { EmailService } from 'src/email/email.service';
import handlePrismaErrors from 'src/errors/handlePrismaErrors';
import { ItemService } from 'src/item/item.service';
import { UserService } from 'src/user/user.service';

import { TransferService } from './transfer.service';
import { StartonGuard } from 'src/guards/starton/starton.guard';

const nullAddress = '0x0000000000000000000000000000000000000000';

@Controller('transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
    private readonly emailService: EmailService,
  ) {}

  @UseGuards(StartonGuard)
  @Post('webhook')
  @HttpCode(200)
  async catchTransfer(@Body() body: any) {
    try {
      const { from, to, id }: TransferSingle = body.data.transferSingle;
      const transfer: Prisma.TransferCreateInput = {
        item: { connect: { tokenId: id.hex.toLowerCase() } },
        to: { connect: { publicAddress: to.toLowerCase() } },
        from: { connect: { publicAddress: from.toLowerCase() } },
        txHash: body.data.transaction.hash.toLowerCase(),
        blockHash: body.data.receipt.blockHash.toLowerCase(),
        blockNumber: body.data.receipt.blockNumber,
      };
      const user = await this.userService.findByUnique(to.toLowerCase());

      console.log(transfer);

      // mint
      if (from === nullAddress) {
        const item: Prisma.ItemCreateInput = {
          contractAddress:
            body.data.transferSingle.contractAddress.toLowerCase(),
          tokenId: id.hex.toLowerCase(),
          owner: { connect: { publicAddress: to.toLowerCase() } },
        };

        await this.itemService.create(item);
      } else {
        await this.itemService.update(id.hex, {
          owner: { connect: { publicAddress: to.toLowerCase() } },
        });
      }

      await this.transferService.create(transfer);

      await this.emailService.sendEmail(
        user.email,
        'NFT Transfer',
        JSON.stringify(body),
      );

      return;
    } catch (err: unknown) {
      handlePrismaErrors(err);

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  @Get()
  findAll() {
    return this.transferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferService.remove(+id);
  }
}
