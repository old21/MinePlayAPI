import { Injectable } from '@nestjs/common';
import { OTPService } from '../../otp.service';
import { User } from 'src/modules/users/users.entity';
import { VerifyService } from 'src/modules/verify/verify.service';
import { EmailTypes } from 'src/modules/verify/verify.types';
import { Confirmation } from '../../../../verify/verify.entity';

@Injectable()
export class EmailService {
  constructor(
    private otpService: OTPService,
    private verifyService: VerifyService,
  ) {}

  async sendCode(user: User, message: string): Promise<Confirmation> {
    return await this.verifyService.generate(
      EmailTypes.OTP,
      user,
      null,
      message,
    );
  }

  async verify(user: User, code: number): Promise<Confirmation> {
    return await this.verifyService.verify(EmailTypes.OTP, user, { code });
  }
}
