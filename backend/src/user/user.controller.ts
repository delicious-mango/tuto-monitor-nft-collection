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
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { handleErrors } from 'src/errors/handleErrors';
import { RemovePasswordFromArrayInterceptor } from 'src/interceptors/remove-password-from-array/remove-password-from-array.interceptor';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password/remove-password.interceptor';

import { AuthGuard } from '../guards/auth/auth.guard';
import { ResponseUserDto } from './dto/reponse-user.dto';
import { UserService } from './user.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

/*
|--------------------------------------------------------------------------
| USER CONTROLLER
|--------------------------------------------------------------------------
*/
@ApiTags('User')
@ApiCookieAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CRUD routes for user
  //--------------------------------------------------------------------------
  @UseGuards(AuthGuard)
  @UseInterceptors(RemovePasswordFromArrayInterceptor)
  @Get()
  async findAll(): Promise<{ users: ResponseUserDto[] } | undefined> {
    try {
      return { users: await this.userService.findAll() };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(RemovePasswordInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findByUnique(id);
      if (!user) throw new NotFoundException();

      return { user: user };
    } catch (err: unknown) {
      handleErrors(err);
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
      return { user: await this.userService.update(id, updateUserDto) };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(RemovePasswordInterceptor)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return { user: await this.userService.remove(id) };
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
