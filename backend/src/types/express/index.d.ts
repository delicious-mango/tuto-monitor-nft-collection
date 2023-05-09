/*
| Developed by Starton
| Filename : index.d.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { JwtPayload } from 'src/contracts/jwt-payload/jwt-payload.interface';

/*
|--------------------------------------------------------------------------
| CUSTOM EXPRESS REQUEST TO ADD USER PROPERTY
|--------------------------------------------------------------------------
*/
declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload;
    }
  }
}
