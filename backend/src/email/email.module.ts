/*
| Developed by Starton
| Filename : email.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';

import { EmailService } from './email.service';

/*
|--------------------------------------------------------------------------
| MAILING MODULE
|--------------------------------------------------------------------------
*/
@Module({
  imports: [],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
