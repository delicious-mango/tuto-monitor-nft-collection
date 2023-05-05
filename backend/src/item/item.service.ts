import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import {
  cryptoquartzCollectionAddress,
  network,
  signerWallet,
} from 'src/contracts/constants';
import { PrismaService } from 'src/prisma/prisma.service';

const contract = axios.create({
  baseURL:
    'https://api.starton.com/v3/smart-contract/' +
    network +
    '/' +
    cryptoquartzCollectionAddress +
    '/',
  headers: {
    'x-api-key': process.env.STARTON_API_KEY,
  },
});

@Injectable()
export class ItemService {
  constructor(private prismaService: PrismaService) {}

  async mint(ownerAddress: string, tokenId: number) {
    try {
      const response = await contract.post('call', {
        signerWallet,
        functionName: 'mint',
        params: [ownerAddress, tokenId, 1, 0x00],
      });

      await this.prismaService.collection.update({
        where: { contractAddress: cryptoquartzCollectionAddress },
        data: { nextTokenId: { increment: 1 } },
      });

      return response.data;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  }

  async burn(ownerAddress: string, tokenId: string) {
    await contract.post('call', {
      signerWallet,
      functionName: 'burn',
      params: [ownerAddress, tokenId, 0x00],
    });
  }

  async create(createItemDto: Prisma.ItemCreateInput) {
    return this.prismaService.item.create({ data: createItemDto });
  }

  async findByOwner(ownerAddress: string) {
    return this.prismaService.item.findMany({ where: { ownerAddress } });
  }

  async findByTokenId(tokenId: string) {
    return this.prismaService.item.findUnique({
      where: { tokenId },
      include: { owner: true, transfers: true },
    });
  }

  async update(tokenId: string, updateItemDto: Prisma.ItemUpdateInput) {
    return this.prismaService.item.update({
      where: { tokenId },
      data: updateItemDto,
    });
  }
}
