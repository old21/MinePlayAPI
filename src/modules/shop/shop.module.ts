import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './shop.entity';
import { ShopService } from './shop.service';
import { WalletsModule } from '../wallets/wallets.module';
import { UserItems } from './user.items.entity';
import { ShopController } from './shop.controller';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../users/sessions/sessions.module';
import { OTPModule } from '../users/OTP/otp.module';
@Module({
  providers: [ShopService],
  controllers: [ShopController],
  imports: [
    OTPModule,
    forwardRef(() => UsersModule),
    SessionsModule,
    TypeOrmModule.forFeature([Shop, UserItems]),
    forwardRef(() => WalletsModule),
  ],
  exports: [ShopService],
})
export class ShopModule {}
