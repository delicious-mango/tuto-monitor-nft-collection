/*
| Developed by Starton
| Filename : transfer.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { contract } from 'src/axios/cryptoquartz-contract.axios-instance';
import { signerWallet } from 'src/contracts/constants';
import { PrismaService } from 'src/prisma/prisma.service';

/*
|--------------------------------------------------------------------------
| Transfer Service
|--------------------------------------------------------------------------
*/
@Injectable()
export class TransferService {
  constructor(private readonly prismaService: PrismaService) {}

  // Create a new transfer record in database
  //--------------------------------------------------------------------------
  async create(createTransferDto: Prisma.TransferCreateInput) {
    await this.prismaService.transfer.create({ data: createTransferDto });
  }

  // Transfer NFT from one user to another using Starton API
  //--------------------------------------------------------------------------
  async transfer(from: string, to: string, id: string) {
    await contract.post('call', {
      signerWallet,
      functionName: 'safeTransferFrom',
      params: [from, to, id, 1, '0x00'],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | FIND TRANSFERS
  |--------------------------------------------------------------------------
  */

  // By sender
  //--------------------------------------------------------------------------
  async findByFrom(from: string) {
    return {
      transfers: await this.prismaService.transfer.findMany({
        where: { from },
        include: { fromUser: true, toUser: true },
      }),
    };
  }

  // By recipient
  //--------------------------------------------------------------------------
  async findByTo(to: string) {
    return {
      transfers: this.prismaService.transfer.findMany({
        where: { to },
        include: { fromUser: true, toUser: true },
      }),
    };
  }

  // By NFT tokenId
  //--------------------------------------------------------------------------
  async findByTokenId(tokenId: string) {
    return {
      transfers: this.prismaService.transfer.findMany({
        where: { item: { tokenId } },
        include: { fromUser: true, toUser: true },
      }),
    };
  }
}
