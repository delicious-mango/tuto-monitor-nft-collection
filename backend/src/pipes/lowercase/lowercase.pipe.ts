/*
| Developed by Starton
| Filename : lowercase.pipe.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

/*
|--------------------------------------------------------------------------
| LOWERCASE ADDRESS PIPE
|--------------------------------------------------------------------------
*/
@Injectable()
export class LowercaseAddressPipe implements PipeTransform {
  transform(value: SignUpDto, metadata: ArgumentMetadata) {
    value.publicAddress = value.publicAddress.toLowerCase();

    return value;
  }
}
