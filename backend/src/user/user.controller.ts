/*
| Developed by Starton
| Filename : user.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import handlePrismaErrors from 'src/errors/handlePrismaErrors';

import { AuthGuard } from '../guards/auth/auth.guard';
import { UserService } from './user.service';
import { RemovePasswordFromArrayInterceptor } from 'src/interceptors/remove-password-from-array/remove-password-from-array.interceptor';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password/remove-password.interceptor';

/*
|--------------------------------------------------------------------------
| USER CONTROLLER
|--------------------------------------------------------------------------
*/
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CRUD routes for user
  //--------------------------------------------------------------------------
  @UseGuards(AuthGuard)
  @UseInterceptors(RemovePasswordFromArrayInterceptor)
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
  @UseInterceptors(RemovePasswordInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findByUnique(id);
      if (!user) throw new NotFoundException();
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw err;

      handlePrismaErrors(err);

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(RemovePasswordInterceptor)
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
  @UseInterceptors(RemovePasswordInterceptor)
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
