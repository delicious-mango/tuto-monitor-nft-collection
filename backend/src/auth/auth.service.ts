import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

import { Credentials } from '../credentials/credentials.interface';
import { InvalidTokenError } from '../errors/invalid-token-error/invalid-token-error';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayload } from 'src/auth/jwt-payload/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly encoder: TextEncoder = new TextEncoder();
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<string> {
    const user = await this.userService.create(signUpDto);

    return this.jwtService.signAsync(
      {},
      {
        algorithm: 'HS256',
        expiresIn: '2h',
        jwtid: uuidv4(),
        subject: user.id,
      },
    );
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const credentials: Credentials = await this.userService.getHashedPassword(
      signInDto.email,
    );

    if (!(await bcrypt.compare(signInDto.password, credentials.password)))
      throw new HttpException('Invalid credentials', 401);
    return this.jwtService.signAsync(
      {},
      {
        algorithm: 'HS256',
        expiresIn: '2h',
        jwtid: uuidv4(),
        subject: credentials.id,
      },
    );
  }

  async revokeToken(token: string): Promise<RevokedToken> {
    const payload = (await this.jwtService.verify(token)) as JwtPayload;

    if (!payload || !payload.jti) throw new InvalidTokenError();
    return this.prisma.revokedToken.create({
      data: {
        jti: payload.jti,
        expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      },
    });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;

    if (!payload || !payload.jti) throw new HttpException('Invalid token', 401);
    const revokedToken = await this.prisma.revokedToken.findUnique({
      where: { jti: payload.jti },
    });
    if (revokedToken) throw new HttpException('Invalid token', 401);
    return payload;
  }
}
