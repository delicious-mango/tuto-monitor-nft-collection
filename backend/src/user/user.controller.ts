import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    try {
      return this.userService.findAll();
    } catch (err: unknown) {
      console.error(err);
      throw new HttpException('Internal server error', 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findByUnique(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
