/*
| Developed by Starton
| Filename : jwt-payload.interface.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

/*
|--------------------------------------------------------------------------
| JWT PAYLOAD INTERFACE
|--------------------------------------------------------------------------
*/
export interface JwtPayload {
  sub: string;
  exp: number;
  jti: string;
  iat: number;
}
