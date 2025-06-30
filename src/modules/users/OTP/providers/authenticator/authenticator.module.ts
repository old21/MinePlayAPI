import { forwardRef, Module } from '@nestjs/common';
import { OTPModule } from '../../otp.module';
import { SessionsModule } from 'src/modules/users/sessions/sessions.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthenticatorService } from './authenticator.service';
import { AuthenticatorController } from './authenticator.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    forwardRef(() => SessionsModule),
    forwardRef(() => OTPModule),
    forwardRef(() => UsersModule),
    EmailModule,
  ],
  providers: [AuthenticatorService],
  controllers: [AuthenticatorController],
  exports: [AuthenticatorService],
})
export class AuthenticatorModule {}
