import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Credentials } from 'src/contracts/credentials/credentials.interface';
import { PrismaService } from 'src/prisma/prisma.service';

import { ResponseUserDto } from './dto/reponse-user.dto';

@Injectable()
export class UserService {
  // ready-to-use prisma select object to query users whithout returning their password
  // TODO: Add middleware
  private readonly selectResponseUserDto: Prisma.UserSelect = {
    id: true,
    email: true,
    password: false,
    publicAddress: true,
    createdAt: true,
  };

  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput): Promise<ResponseUserDto> {
    user.password = await bcrypt.hash(user.password, 10);

    return this.prisma.user.create({
      data: user,
      select: this.selectResponseUserDto,
    }) as Promise<ResponseUserDto>;
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.prisma.user.findMany({
      select: this.selectResponseUserDto,
    });

    return users as ResponseUserDto[];
  }

  async findByUnique(unique: string): Promise<ResponseUserDto> {
    // Can't search on a malformed objectID
    if (unique.length === 24)
      return this.prisma.user.findUniqueOrThrow({
        where: { id: unique },
        select: this.selectResponseUserDto,
      }) as Promise<ResponseUserDto>;

    return this.prisma.user.findFirstOrThrow({
      where: {
        OR: [{ email: unique }, { publicAddress: unique }],
      },
      select: this.selectResponseUserDto,
    }) as Promise<ResponseUserDto>;
  }

  async getHashedPassword(email: string): Promise<Credentials> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { email },
      select: { id: true, password: true },
    });
  }

  async update(
    id: string,
    updateUserData: Prisma.UserUpdateInput,
  ): Promise<ResponseUserDto> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserData,
      select: this.selectResponseUserDto,
    }) as Promise<ResponseUserDto>;
  }

  async remove(id: string): Promise<ResponseUserDto> {
    return this.prisma.user.delete({
      where: { id },
      select: this.selectResponseUserDto,
    }) as Promise<ResponseUserDto>;
  }
}
