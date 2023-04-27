import {
  Body,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Post,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Prisma } from '@prisma/client';
import { InvalidTokenError } from 'src/errors/invalid-token-error/invalid-token-error';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      return { jwt: await this.authService.signUp(signUpDto) };
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            throw new ConflictException('E-mail already exists');
          default:
            break;
        }
      }
      console.error(err);
      throw new HttpException('Internal server error', 500);
    }
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    try {
      return { jwt: await this.authService.signIn(signInDto) };
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            throw new HttpException('User not found', 404);
          default:
            break;
        }
      }
      console.error(err);
      throw new HttpException('Internal server error', 500);
    }
  }

  @Delete('revoke-token')
  @HttpCode(200)
  async revokeToken(@Body('token') token: string) {
    try {
      return await this.authService.revokeToken(token);
    } catch (err: unknown) {
      if (err instanceof InvalidTokenError)
        throw new HttpException('Invalid token', 400);
      console.error(err);
      throw new HttpException('Internal server error', 500);
    }
  }
}
