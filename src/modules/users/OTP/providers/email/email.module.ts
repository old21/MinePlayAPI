import { forwardRef, Module } from '@nestjs/common';
import { OTPModule } from '../../otp.module';
import { SessionsModule } from 'src/modules/users/sessions/sessions.module';
import { UsersModule } from 'src/modules/users/users.module';
import { EmailService } from './email.service';
import { VerifyModule } from 'src/modules/verify/verify.module';

@Module({
  imports: [
    forwardRef(() => SessionsModule),
    forwardRef(() => OTPModule),
    forwardRef(() => UsersModule),
    VerifyModule,
  ],
  providers: [EmailService],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule {}
