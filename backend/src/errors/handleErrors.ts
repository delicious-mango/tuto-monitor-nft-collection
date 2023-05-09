/*
| Developed by Starton
| Filename : handlePrismaErrors.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { InvalidTokenError } from './invalid-token-error/invalid-token-error';

/*
|--------------------------------------------------------------------------
| WRAPPER TO HANDLE ERRORS
|--------------------------------------------------------------------------
*/
export function handleErrors(err: unknown) {
  if (err instanceof InvalidTokenError)
    throw new BadRequestException('Invalid token');

  if (err instanceof NotFoundException) throw err;

  // If the call to the Starton API fails, throw the HttpException
  //--------------------------------------------------------------------------
  if (err instanceof AxiosError) {
    throw new HttpException(err.response?.data, Number(err.response?.status));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaErrors(err);
  }

  // If the error is not handled, log it and throw a 500 Internal Server Error
  //--------------------------------------------------------------------------
  console.error(err);
  throw new InternalServerErrorException();
}

/*
|--------------------------------------------------------------------------
| WRAPPER TO HANDLE PRISMA ERRORS
|--------------------------------------------------------------------------
*/
export function handlePrismaErrors(err: unknown) {
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
