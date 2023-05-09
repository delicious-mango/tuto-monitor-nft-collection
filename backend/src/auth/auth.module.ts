/*
| Developed by Starton
| Filename : auth.module.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';

import { AuthGuard } from '../guards/auth/auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION MODULE
|--------------------------------------------------------------------------
*/
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, AuthGuard],
  exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule {}
