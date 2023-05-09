/*
| Developed by Starton
| Filename : prisma.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/*
|--------------------------------------------------------------------------
| PRISMA MODULE (USED TO INTERACT WITH THE DATABASE)
|--------------------------------------------------------------------------
*/
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
