import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './otp.entity';
import { OTPService } from './otp.service';
import { OtpController } from './otp.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users.module';
import { OTPGuard } from './otp.guard';
import { AuthenticatorModule } from './providers/authenticator/authenticator.module';
import { EmailModule } from './providers/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OTP]),
    forwardRef(() => SessionsModule),
    AuthenticatorModule,
    EmailModule,
    forwardRef(() => UsersModule),
  ],
  providers: [OTPService, OTPGuard],
  controllers: [OtpController],
  exports: [OTPService, AuthenticatorModule, OTPGuard],
})
export class OTPModule {}
