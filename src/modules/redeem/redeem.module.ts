import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedeemCode } from './redeem.entity';
import { RedeemService } from './redeem.service';
import { WalletsModule } from '../wallets/wallets.module';
import { RedeemController } from './redeem.controller';
import { SessionsModule } from '../users/sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { OTPModule } from '../users/OTP/otp.module';
import { EmailModule } from '../users/OTP/providers/email/email.module';
@Module({
  providers: [RedeemService],
  controllers: [RedeemController],
  imports: [
    TypeOrmModule.forFeature([RedeemCode]),
    WalletsModule,
    SessionsModule,
    UsersModule,
    OTPModule,
    EmailModule,
  ],
  exports: [],
})
export class RedeemModule {}
