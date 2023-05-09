/*
| Developed by Starton
| Filename : starton.guard.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Request } from 'express';

/*
|--------------------------------------------------------------------------
| STARTON'S SIGNATURE VERIFICATION GUARD
|--------------------------------------------------------------------------
*/
@Injectable()
export class StartonGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const payload = JSON.stringify(request.body);

    const reqSignature = request.get('starton-signature');
    if (!reqSignature) return false;

    // Re-compute the signature and compare it with the one received
    //--------------------------------------------------------------------------
    const localSignature = createHmac(
      'sha256',
      process.env.STARTON_SECRET as string,
    )
      .update(Buffer.from(payload))
      .digest('hex');

    return reqSignature === localSignature;
  }
}
