import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransferService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTransferDto: Prisma.TransferCreateInput) {
    await this.prismaService.transfer.create({ data: createTransferDto });
  }

  findAll() {
    return `This action returns all transfer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transfer`;
  }

  remove(id: number) {
    return `This action removes a #${id} transfer`;
  }
}
