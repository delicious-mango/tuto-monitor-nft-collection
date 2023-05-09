/*
| Developed by Starton
| Filename : auth.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { handleErrors } from 'src/errors/handleErrors';
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
      handleErrors(err);
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
      handleErrors(err);
    }
  }

  // sign-out / revoke JWT route
  //--------------------------------------------------------------------------
  @Delete('revoke-token')
  async revokeToken(@Body('token') token: string) {
    try {
      return await this.authService.revokeToken(token);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
