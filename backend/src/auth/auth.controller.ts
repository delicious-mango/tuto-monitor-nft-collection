import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InvalidTokenError } from 'src/errors/invalid-token-error/invalid-token-error';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { LowercaseAddressPipe } from 'src/lowercase/lowercase.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body(new LowercaseAddressPipe()) signUpDto: SignUpDto,
    @Res() res: Response,
  ) {
    try {
      res.cookie('jwt', await this.authService.signUp(signUpDto), {
        httpOnly: true,
      });
      res.sendStatus(201);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            console.error(err);
            throw new ConflictException(
              'E-mail or public address already exists',
            );
          default:
            break;
        }
      }
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      res.cookie('jwt', await this.authService.signIn(signInDto), {
        httpOnly: true,
      });

      res.sendStatus(200);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            throw new NotFoundException('User not found');
          default:
            break;
        }
      }
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  @Delete('revoke-token')
  async revokeToken(@Body('token') token: string) {
    try {
      return await this.authService.revokeToken(token);
    } catch (err: unknown) {
      if (err instanceof InvalidTokenError)
        throw new BadRequestException('Invalid token');
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
