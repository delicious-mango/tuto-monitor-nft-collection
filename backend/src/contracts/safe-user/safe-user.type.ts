/*
| Developed by Starton
| Filename : safe-user.type.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { User } from '@prisma/client';

/*
|--------------------------------------------------------------------------
| USER WITHOUT PASSWORD TYPE
|--------------------------------------------------------------------------
*/
export type SafeUser = Omit<User, 'password'>;
