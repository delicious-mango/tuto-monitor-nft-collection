import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

const network = 'polygon-mumbai';
const cryptoquartzCollectionAddress =
  '0x501D90CdBd220BeB9C590b918a377741eDC10Fd9';
const signerWallet = '0x1bb9D826B25e1edBe5E9fFF1D557BfF7bd350Ee7';

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
export class TransferService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTransferDto: Prisma.TransferCreateInput) {
    await this.prismaService.transfer.create({ data: createTransferDto });
  }

  async transfer(from: string, to: string, id: string) {
    await contract.post('call', {
      signerWallet,
      functionName: 'safeTransferFrom',
      params: [from, to, id, 1, '0x00'],
    });
  }

  async findByFrom(from: string) {
    return this.prismaService.transfer.findMany({
      where: { from },
      include: { fromUser: true, toUser: true },
    });
  }

  async findByTo(to: string) {
    return this.prismaService.transfer.findMany({
      where: { to },
      include: { fromUser: true, toUser: true },
    });
  }
}
