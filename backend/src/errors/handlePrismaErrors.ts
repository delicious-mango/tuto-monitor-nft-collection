import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export default async function handlePrismaErrors(err: unknown) {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return;

  switch (err.code) {
    case 'P2025':
      throw new NotFoundException();

    case 'P2002':
      throw new ConflictException();

    default:
      break;
  }

  console.error(err);
  throw new InternalServerErrorException();
}
