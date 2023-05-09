/*
| Developed by Starton
| Filename : auth.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { handleErrors } from 'src/errors/handleErrors';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { LowercaseAddressPipe } from 'src/pipes/lowercase/lowercase.pipe';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION CONTROLLER
|--------------------------------------------------------------------------
*/
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body(new LowercaseAddressPipe()) signUpDto: SignUpDto,
    @Res() res: Response,
  ) {
    try {
      // We set the JWT in a cookie when sign up / sign in
      //--------------------------------------------------------------------------
      res.cookie('jwt', await this.authService.signUp(signUpDto), {
        httpOnly: true,
      });

      res.sendStatus(201);
    } catch (err: unknown) {
      handleErrors(err);
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
      handleErrors(err);
    }
  }

  // sign-out / revoke JWT route
  //--------------------------------------------------------------------------
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Delete('revoke-token')
  async revokeToken(@Req() req: Request) {
    try {
      return await this.authService.revokeToken(req.user.jti);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
