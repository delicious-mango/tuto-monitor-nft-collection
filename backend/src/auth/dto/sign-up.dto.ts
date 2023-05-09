/*
| Developed by Starton
| Filename : sign-up.dto.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { IsEmail, IsString, IsEthereumAddress } from 'class-validator';

/*
|--------------------------------------------------------------------------
| SIGN-UP DTO
|--------------------------------------------------------------------------
*/
export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEthereumAddress()
  publicAddress: string;
}
