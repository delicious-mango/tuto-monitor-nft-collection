import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Credentials } from 'src/contracts/credentials/credentials.interface';
import { PrismaService } from 'src/prisma/prisma.service';

import { ResponseUserDto } from './dto/reponse-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput): Promise<ResponseUserDto> {
    user.password = await bcrypt.hash(user.password, 10);

    return this.prisma.user.create({
      data: user,
    });
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.prisma.user.findMany({});

    return users as ResponseUserDto[];
  }

  async findByUnique(unique: string): Promise<ResponseUserDto | null> {
    // Can't search on a malformed objectID
    if (unique.length === 24)
      return this.prisma.user.findUnique({
        where: { id: unique },
      });

    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: unique }, { publicAddress: unique }],
      },
    });
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
    });
  }

  async remove(id: string): Promise<ResponseUserDto> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
