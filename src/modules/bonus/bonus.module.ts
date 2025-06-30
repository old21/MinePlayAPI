import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bonus } from './bonus.enitity';
import { BonusesService } from './bonus.service';
import { BonusesController } from './bonus.controller';
import { SessionsModule } from '../users/sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { OTPModule } from '../users/OTP/otp.module';
@Module({
  providers: [BonusesService],
  controllers: [BonusesController],
  imports: [
    TypeOrmModule.forFeature([Bonus]),
    UsersModule,
    SessionsModule,
    OTPModule,
  ],
  exports: [],
})
export class BonusModule {}
