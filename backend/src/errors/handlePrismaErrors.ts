/*
| Developed by Starton
| Filename : handlePrismaErrors.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

/*
|--------------------------------------------------------------------------
| WRAPPER TO HANDLE PRISMA ERRORS
|--------------------------------------------------------------------------
*/
export default function handlePrismaErrors(err: unknown) {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return;

  switch (err.code) {
    // 404 Not Found
    //--------------------------------------------------------------------------
    case 'P2025':
      throw new NotFoundException();

    // 409 Conflict
    //--------------------------------------------------------------------------
    case 'P2002':
      throw new ConflictException();

    default:
      break;
  }

  // 500 Internal Server Error  + logging if not handled
  //--------------------------------------------------------------------------
  console.error(err);
  throw new InternalServerErrorException();
}
