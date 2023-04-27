import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ItemModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
