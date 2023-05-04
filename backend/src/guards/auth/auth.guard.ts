import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JwtPayload } from '../../contracts/jwt-payload/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();

      const payload: JwtPayload = await this.jwtService.verifyAsync(
        request.cookies['jwt'],
        { secret: process.env.JWT_SECRET },
      );

      request.user = payload;

      return true;
    } catch (err: unknown) {
      throw new UnauthorizedException();
    }
  }
}
