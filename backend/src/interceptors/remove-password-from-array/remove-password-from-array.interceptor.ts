/*
| Developed by Starton
| Filename : remove-password-from-array.interceptor.ts
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
| PASSWORD REMOVAL INTERCEPTOR (ARRAY OF USER OBJECTS)
|--------------------------------------------------------------------------
*/
@Injectable()
export class RemovePasswordFromArrayInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: { users: User[] }): { users: SafeUser[] } => {
        for (const user of data.users) {
          delete user.password;
        }
        return data;
      }),
    );
  }
}
