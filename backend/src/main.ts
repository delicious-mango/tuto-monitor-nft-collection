/*
| Developed by Starton
| Filename : main.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

/*
|--------------------------------------------------------------------------
| ENTRY POINT
|--------------------------------------------------------------------------
*/
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  //--------------------------------------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('Monitor & Notify NFT transfers API')
    .setDescription('The Monitor & Notify NFT transfers API description')
    .setVersion('1.0')
    .addTag('Cryptomancy')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  // Global middlewares
  //--------------------------------------------------------------------------
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
