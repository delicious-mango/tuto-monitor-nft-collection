import { HttpException, Injectable } from '@nestjs/common';
import { RevokedToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jose from 'jose';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

import { Credentials } from '../credentials/credentials.interface';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InvalidTokenError } from '../errors/invalid-token-error/invalid-token-error';

@Injectable()
export class AuthService {
  private readonly encoder: TextEncoder = new TextEncoder();
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<string> {
    const user = await this.userService.create(signUpDto);

    return new jose.SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(uuidv4())
      .setIssuedAt()
      .setExpirationTime('2h')
      .setSubject(user.id)
      .sign(this.encoder.encode(process.env.JWT_SECRET));
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const credentials: Credentials = await this.userService.getHashedPassword(
      signInDto.email,
    );

    // Check the hash of the given password against hashed password stored in database
    if (!(await bcrypt.compare(signInDto.password, credentials.password)))
      throw new HttpException('Invalid credentials', 401);
    return new jose.SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(uuidv4())
      .setIssuedAt()
      .setExpirationTime('2h')
      .setSubject(credentials.id)
      .sign(this.encoder.encode(process.env.JWT_SECRET));
  }

  async revokeToken(token: string): Promise<RevokedToken> {
    const payload = await jose.decodeJwt(token);

    if (!payload || !payload.jti) throw new InvalidTokenError();
    return this.prisma.revokedToken.create({
      data: {
        jti: payload.jti,
        expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      },
    });
  }

  async verifyToken(token: string): Promise<jose.JWTPayload> {
    const payload = await jose.decodeJwt(token);

    if (!payload || !payload.jti) throw new HttpException('Invalid token', 401);
    const revokedToken = await this.prisma.revokedToken.findUnique({
      where: { jti: payload.jti },
    });
    if (revokedToken) throw new HttpException('Invalid token', 401);
    return payload;
  }
}
