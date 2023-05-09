/*
| Developed by Starton
| Filename : auth.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import handlePrismaErrors from 'src/errors/handlePrismaErrors';
import { InvalidTokenError } from 'src/errors/invalid-token-error/invalid-token-error';
import { LowercaseAddressPipe } from 'src/pipes/lowercase/lowercase.pipe';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION CONTROLLER
|--------------------------------------------------------------------------
*/
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // sign-up route
  //--------------------------------------------------------------------------
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
      handlePrismaErrors(err);

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // sign-in route
  //--------------------------------------------------------------------------
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      res.cookie('jwt', await this.authService.signIn(signInDto), {
        httpOnly: true,
      });

      res.sendStatus(200);
    } catch (err: unknown) {
      handlePrismaErrors(err);

      if (err instanceof InvalidTokenError)
        throw new BadRequestException('Invalid token');

      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // sign-out / revoke JWT route
  //--------------------------------------------------------------------------
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
