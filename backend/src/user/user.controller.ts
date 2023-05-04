import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import handlePrismaErrors from 'src/errors/handlePrismaErrors';

import { AuthGuard } from '../guards/auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      return this.userService.findAll();
    } catch (err: unknown) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.userService.findByUnique(id);
    } catch (err: unknown) {
      handlePrismaErrors(err);

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (err: unknown) {
      handlePrismaErrors(err);

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.userService.remove(id);
    } catch (err: unknown) {
      handlePrismaErrors(err);

      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
