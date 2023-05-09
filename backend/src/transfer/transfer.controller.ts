/*
| Developed by Starton
| Filename : transfer.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AxiosError } from 'axios';
import { nullAddress } from 'src/contracts/constants';
import { TransferSingle } from 'src/contracts/transfer-single/transfer-single.interface';
import { EmailService } from 'src/email/email.service';
import handlePrismaErrors from 'src/errors/handlePrismaErrors';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { StartonGuard } from 'src/guards/starton/starton.guard';
import { ItemService } from 'src/item/item.service';
import { UserService } from 'src/user/user.service';

import { TransferDto } from './dto/transfer.dto';
import { TransferService } from './transfer.service';

/*
|--------------------------------------------------------------------------
| NFT-TRANSFERS-RELATED CONTROLLER
|--------------------------------------------------------------------------
*/
@Controller('transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
    private readonly emailService: EmailService,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | WEBHOOK LISTENING TO TRANSFER EVENTS FROM STARTON
  |--------------------------------------------------------------------------
  */
  @UseGuards(StartonGuard)
  @Post('webhook')
  @HttpCode(200)
  async catchTransfer(@Body() body: any) {
    try {
      const { from, to, id }: TransferSingle = body.data.transferSingle;
      const transfer: Prisma.TransferCreateInput = {
        item: { connect: { tokenId: id.hex.toLowerCase() } },
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        toUser: { connect: { publicAddress: to.toLowerCase() } },
        fromUser: { connect: { publicAddress: from.toLowerCase() } },
        txHash: body.data.transaction.hash.toLowerCase(),
        blockHash: body.data.receipt.blockHash.toLowerCase(),
        blockNumber: body.data.receipt.blockNumber,
      };

      // Check if user exists, if not, don't connect records
      //--------------------------------------------------------------------------
      const toUser = await this.userService.findByUnique(to.toLowerCase());
      if (!toUser) delete transfer.toUser;
      const fromUser = await this.userService.findByUnique(from.toLowerCase());
      if (!fromUser) delete transfer.fromUser;

      // In case of minting, create an item record
      //--------------------------------------------------------------------------
      if (from === nullAddress) {
        const item: Prisma.ItemCreateInput = {
          tokenId: id.hex.toLowerCase(),
          ownerAddress: to.toLowerCase(),
          owner: {
            connect: toUser ? { publicAddress: to.toLowerCase() } : undefined,
          },
          collection: {
            connect: {
              contractAddress:
                body.data.transferSingle.contractAddress.toLowerCase(),
            },
          },
        };

        await this.itemService.create(item);
      } else {
        // Otherwise, update the item's owner
        //--------------------------------------------------------------------------
        await this.itemService.update(id.hex, {
          ownerAddress: to.toLowerCase(),
          owner: {
            disconnect: fromUser
              ? { publicAddress: from.toLowerCase() }
              : undefined,
            connect: toUser ? { publicAddress: to.toLowerCase() } : undefined,
          },
        });
      }

      // Create the transfer record
      //--------------------------------------------------------------------------
      await this.transferService.create(transfer);

      // If the recipient is a user, send an email
      //--------------------------------------------------------------------------
      if (!toUser) return;

      await this.emailService.sendEmail(
        toUser.email,
        'NFT Transfer',
        'The address ' +
          from +
          ' sent the NFT #' +
          id.hex +
          ' to your address ' +
          to +
          '.',
      );

      return;
    } catch (err: unknown) {
      console.error(err);
      handlePrismaErrors(err);

      throw new InternalServerErrorException();
    }
  }

  /*
  |--------------------------------------------------------------------------
  | TRANSFER AN NFT
  |--------------------------------------------------------------------------
  */
  @UseGuards(AuthGuard)
  @Post()
  async transfer(@Body() body: TransferDto) {
    try {
      const { from, to, id } = body;

      await this.transferService.transfer(from, to, id);
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        throw new HttpException(
          err.response?.data.message,
          Number(err.response?.status),
        );

      handlePrismaErrors(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GET TRANSFERS
  |--------------------------------------------------------------------------
  */

  // By sender
  //--------------------------------------------------------------------------
  @Get('/from/:address')
  findByFrom(@Param('address') address: string) {
    return this.transferService.findByFrom(address);
  }

  // By recipient
  //--------------------------------------------------------------------------
  @Get('/to/:address')
  findByTo(@Param('address') address: string) {
    return this.transferService.findByTo(address);
  }

  // By item
  //--------------------------------------------------------------------------
  @Get('/item/:tokenId')
  findByItem(@Param('tokenId') tokenId: string) {
    return this.transferService.findByTokenId(tokenId);
  }
}
