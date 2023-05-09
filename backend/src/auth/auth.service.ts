/*
| Developed by Starton
| Filename : auth.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/contracts/jwt-payload/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

import { Credentials } from '../contracts/credentials/credentials.interface';
import { InvalidTokenError } from '../errors/invalid-token-error/invalid-token-error';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION SERVICE
|--------------------------------------------------------------------------
*/
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // sign-up method
  //--------------------------------------------------------------------------
  async signUp(signUpDto: SignUpDto): Promise<string> {
    const user = await this.userService.create(signUpDto);

    return this.jwtService.signAsync(
      {},
      {
        jwtid: uuidv4(),
        subject: user.id,
      },
    );
  }

  // sign-in method
  //--------------------------------------------------------------------------
  async signIn(signInDto: SignInDto): Promise<string> {
    const credentials: Credentials = await this.userService.getHashedPassword(
      signInDto.email,
    );

    if (!(await bcrypt.compare(signInDto.password, credentials.password)))
      throw new HttpException('Invalid credentials', 401);
    return this.jwtService.signAsync(
      {},
      {
        jwtid: uuidv4(),
        subject: credentials.id,
      },
    );
  }

  // sign-out / revoke token method
  //--------------------------------------------------------------------------
  async revokeToken(token: string): Promise<RevokedToken> {
    const payload = (await this.jwtService.verify(token)) as JwtPayload;

    if (!payload || !payload.jti) throw new InvalidTokenError();
    return this.prisma.revokedToken.create({
      data: { jti: payload.jti },
    });
  }
}
