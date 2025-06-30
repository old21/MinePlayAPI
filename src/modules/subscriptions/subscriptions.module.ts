import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscriptions.entity';
import { SubscriptionsService } from './subscriptions.service';
import { UsersModule } from '../users/users.module';
import { ShopModule } from '../shop/shop.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SessionsModule } from '../users/sessions/sessions.module';
import { OTPModule } from '../users/OTP/otp.module';
@Module({
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    OTPModule,
    forwardRef(() => UsersModule),
    ShopModule,
    SessionsModule,
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
