/*
| Developed by Starton
| Filename : sign-in.dto.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { IsEmail, IsNotEmpty } from 'class-validator';

/*
|--------------------------------------------------------------------------
| SIGN-IN DTO
|--------------------------------------------------------------------------
*/
export class SignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
