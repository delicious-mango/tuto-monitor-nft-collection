/*
| Developed by Starton
| Filename : item.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Item } from '@prisma/client';
import { Request } from 'express';
import { cryptoquartzCollectionAddress } from 'src/contracts/constants';
import { handleErrors } from 'src/errors/handleErrors';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

import { AuthGuard } from '../guards/auth/auth.guard';
import { ItemService } from './item.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

/*
|--------------------------------------------------------------------------
| ITEM CONTROLLER
|--------------------------------------------------------------------------
*/
@ApiTags('Items')
@Controller('item')
export class ItemController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly itemService: ItemService,
    private readonly userService: UserService,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | MINTING ROUTE
  |--------------------------------------------------------------------------
  */
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('mint')
  async mint(@Req() req: Request): Promise<void> {
    try {
      // Check if user and collection exists
      //--------------------------------------------------------------------------
      const user = await this.userService.findByUnique(req.user.sub);
      if (user === null) throw new NotFoundException();

      const collection = await this.prismaService.collection.findUnique({
        where: { contractAddress: cryptoquartzCollectionAddress },
      });
      if (collection === null) throw new NotFoundException();

      // Call to the minting service
      //--------------------------------------------------------------------------
      await this.itemService.mint(user.publicAddress, collection.nextTokenId);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | BURNING ROUTE
  |--------------------------------------------------------------------------
  */
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete('burn/:tokenId')
  async burn(@Req() req: Request, @Param('id') tokenId: string): Promise<void> {
    try {
      const user = await this.userService.findByUnique(req.user.sub);
      if (!user) throw new NotFoundException();

      await this.itemService.burn(user.publicAddress, tokenId);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GET ROUTES
  |--------------------------------------------------------------------------
  */

  // Get user's NFTs
  //--------------------------------------------------------------------------
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('mine')
  async getMine(@Req() req: Request): Promise<{ items: Item[] } | undefined> {
    try {
      const user = await this.userService.findByUnique(req.user.sub);
      if (!user) throw new NotFoundException();

      return { items: await this.itemService.findByOwner(user.publicAddress) };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  // Get NFTs by owner's address
  //--------------------------------------------------------------------------
  @Get(':address')
  async getByAddress(
    @Param('address') address: string,
  ): Promise<{ items: Item[] } | undefined> {
    try {
      return { items: await this.itemService.findByOwner(address) };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  // Get NFT by tokenId
  //--------------------------------------------------------------------------
  @Get(':tokenId')
  async findOne(@Param('tokenId') tokenId: string) {
    try {
      return { item: await this.itemService.findByTokenId(tokenId) };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
