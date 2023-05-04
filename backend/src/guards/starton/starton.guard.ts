import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Request } from 'express';

@Injectable()
export class StartonGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const payload = JSON.stringify(request.body);

    const reqSignature = request.get('starton-signature');
    if (!reqSignature) return false;

    const localSignature = createHmac(
      'sha256',
      process.env.STARTON_SECRET as string,
    )
      .update(Buffer.from(payload))
      .digest('hex');

    return reqSignature === localSignature;
  }
}
