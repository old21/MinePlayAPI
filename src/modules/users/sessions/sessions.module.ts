import { Module, forwardRef } from '@nestjs/common';
import { Session } from './sessions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { UsersModule } from '../users.module';
import { AuthModule } from '../auth/auth.module';
import { WalletsModule } from 'src/modules/wallets/wallets.module';
import { OTPModule } from '../OTP/otp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => WalletsModule),
    OTPModule,
  ],
  providers: [SessionsService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}
