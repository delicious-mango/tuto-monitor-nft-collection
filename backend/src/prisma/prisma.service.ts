/*
| Developed by Starton
| Filename : prisma.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/*
|--------------------------------------------------------------------------
| PRISMA SERVICE (WRAPPER TO INIT PRISMA CONNECTION TO THE DATABASE)
|--------------------------------------------------------------------------
*/
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
