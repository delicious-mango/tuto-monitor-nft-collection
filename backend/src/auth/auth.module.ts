import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [PrismaService, AuthService],
})
export class AuthModule {}
