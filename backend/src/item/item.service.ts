/*
| Developed by Starton
| Filename : item.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { contract } from 'src/axios/cryptoquartz-contract.axios-instance';
import {
  cryptoquartzCollectionAddress,
  signerWallet,
} from 'src/contracts/constants';
import { PrismaService } from 'src/prisma/prisma.service';

/*
|--------------------------------------------------------------------------
| ITEM SERVICE
|--------------------------------------------------------------------------
*/
@Injectable()
export class ItemService {
  constructor(private prismaService: PrismaService) {}

  /*
  |--------------------------------------------------------------------------
  | NFT MINTING FUNCTION
  |--------------------------------------------------------------------------
  */
  async mint(ownerAddress: string, tokenId: number) {
    // Starton API call to mint NFT
    //--------------------------------------------------------------------------
    const response = await contract.post('call', {
      signerWallet,
      functionName: 'mint',
      params: [ownerAddress, tokenId, 1, 0x00],
    });

    // Increment nextTokenId in database
    //--------------------------------------------------------------------------
    await this.prismaService.collection.update({
      where: { contractAddress: cryptoquartzCollectionAddress },
      data: { nextTokenId: { increment: 1 } },
    });

    return response.data;
  }

  /*
  |--------------------------------------------------------------------------
  | NFT BURNING FUNCTION
  |--------------------------------------------------------------------------
  */
  async burn(ownerAddress: string, tokenId: string) {
    // Starton API call to burn NFT (DB updates handled by webhook)
    //--------------------------------------------------------------------------
    await contract.post('call', {
      signerWallet,
      functionName: 'burn',
      params: [ownerAddress, tokenId, 0x00],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE OPERATION FOR ITEM
  |--------------------------------------------------------------------------
  */
  async create(createItemDto: Prisma.ItemCreateInput) {
    return await this.prismaService.item.create({ data: createItemDto });
  }

  /*
  |--------------------------------------------------------------------------
  | GET OPERATIONS FOR ITEM
  |--------------------------------------------------------------------------
  */

  // Get items by owner address
  //--------------------------------------------------------------------------
  async findByOwner(ownerAddress: string) {
    return await this.prismaService.item.findMany({
      where: { ownerAddress },
    });
  }

  // Get item by tokenId
  //--------------------------------------------------------------------------
  async findByTokenId(tokenId: string) {
    return await this.prismaService.item.findUnique({
      where: { tokenId },
      include: { owner: true, transfers: true },
    });
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE OPERATION FOR ITEM
  |--------------------------------------------------------------------------
  */
  async update(tokenId: string, updateItemDto: Prisma.ItemUpdateInput) {
    return await this.prismaService.item.update({
      where: { tokenId },
      data: updateItemDto,
    });
  }
}
