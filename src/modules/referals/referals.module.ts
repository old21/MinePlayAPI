import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referal } from './referals.entity';
import { ReferalsService } from './referals.service';
import { ReferalsController } from './referals.controller';
import { UsersModule } from '../users/users.module';
import { Referal_level } from './levels/referals.levels.entity';
import { ReferalsLevelsService } from './levels/referals.levels.service';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthModule } from '../users/auth/auth.module';
import { SessionsModule } from '../users/sessions/sessions.module';
import { OTPModule } from '../users/OTP/otp.module';

@Module({
  controllers: [ReferalsController],
  providers: [ReferalsLevelsService, ReferalsService],
  exports: [ReferalsService],
  imports: [
    TypeOrmModule.forFeature([Referal, Referal_level]),
    OTPModule,
    forwardRef(() => SessionsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => WalletsModule),
    forwardRef(() => UsersModule),
  ],
})
export class ReferalsModule {}
