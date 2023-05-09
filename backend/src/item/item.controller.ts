/*
| Developed by Starton
| Filename : item.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  Controller,
  Delete,
  Post,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Req,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import handlePrismaErrors from 'src/errors/handlePrismaErrors';

import { AuthGuard } from '../guards/auth/auth.guard';
import { ItemService } from './item.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { cryptoquartzCollectionAddress } from 'src/contracts/constants';
import { AxiosError } from 'axios';

/*
|--------------------------------------------------------------------------
| ITEM CONTROLLER
|--------------------------------------------------------------------------
*/
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
  @UseGuards(AuthGuard)
  @Post('mint')
  async mint(@Req() req: Request) {
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
      if (err instanceof NotFoundException) throw err;

      // If the call to Starton API fails, throw the HttpException
      //--------------------------------------------------------------------------
      if (err instanceof AxiosError) {
        throw new HttpException(
          err.response?.data,
          Number(err.response?.status),
        );
      }

      handlePrismaErrors(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | BURNING ROUTE
  |--------------------------------------------------------------------------
  */
  @UseGuards(AuthGuard)
  @Delete(':tokenId')
  async burn(@Req() req: Request, @Param('id') tokenId: string) {
    const user = await this.userService.findByUnique(req.user.sub);
    if (!user) throw new NotFoundException();

    return this.itemService.burn(user.publicAddress, tokenId);
  }

  /*
  |--------------------------------------------------------------------------
  | GET ROUTES
  |--------------------------------------------------------------------------
  */

  // Get user's NFTs
  //--------------------------------------------------------------------------
  @UseGuards(AuthGuard)
  @Get('mine')
  async getMine(@Req() req: Request) {
    const user = await this.userService.findByUnique(req.user.sub);
    if (!user) throw new NotFoundException();

    return this.itemService.findByOwner(user.publicAddress);
  }

  // Get NFTs by owner's address
  //--------------------------------------------------------------------------
  @Get(':address')
  async getByAddress(@Param('address') address: string) {
    try {
      return this.itemService.findByOwner(address);
    } catch (err: unknown) {
      handlePrismaErrors(err);

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // Get NFT by tokenId
  //--------------------------------------------------------------------------
  @UseGuards(AuthGuard)
  @Get(':tokenId')
  async findOne(@Param('tokenId') tokenId: string) {
    return this.itemService.findByTokenId(tokenId);
  }
}
