/*
| Developed by Starton
| Filename : user.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

/*
|--------------------------------------------------------------------------
| USER MODULE
|--------------------------------------------------------------------------
*/
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
