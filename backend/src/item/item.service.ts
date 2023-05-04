import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private prismaService: PrismaService) {}

  async create(mintItemDto: Prisma.ItemCreateInput) {
    await this.prismaService.item.create({ data: mintItemDto });
  }

  findAll() {
    return `This action returns all item`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  async update(id: string, updateItemDto: Prisma.ItemUpdateInput) {
    await this.prismaService.item.update({
      where: { tokenId: id },
      data: updateItemDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} item`;
  }
}
