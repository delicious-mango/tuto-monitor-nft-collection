/*
| Developed by Starton
| Filename : remove-password.interceptor.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SafeUser } from 'src/contracts/safe-user/safe-user.type';
import { User } from 'src/contracts/user/user.interface';

/*
|--------------------------------------------------------------------------
| PASSWORD REMOVAL INTERCEPTOR (SINGLE USER OBJECT)
|--------------------------------------------------------------------------
*/
@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: { user: User }): { user: SafeUser } => {
        delete data.user.password;
        return data;
      }),
    );
  }
}
