import { Injectable } from '@nestjs/common';

import * as TOTP from 'node-2fa';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { OTPService } from '../../otp.service';
import { Session } from 'src/modules/users/sessions/sessions.entity';
import { User } from 'src/modules/users/users.entity';
import { OTPProviders } from '../../otp.types';
import { OTP } from '../../otp.entity';

@Injectable()
export class AuthenticatorService {
  constructor(private otpService: OTPService) {}

  async generateAuthenticatorSecret(user: User, session: Session) {
    const totpData = TOTP.generateSecret({
      name: 'Mine-Play',
      account: user.name,
    });
    const otp = await this.otpService.getUserOTP(
      user,
      OTPProviders.AUTHENTICATOR,
      false,
    );
    if (otp) {
      otp.secret = totpData.secret;
      otp.createdBy = session;
      await this.otpService.updateUserOTP(otp);
    } else {
      await this.otpService.setUserOTP(
        user,
        OTPProviders.AUTHENTICATOR,
        session,
        totpData.secret,
      );
    }

    return totpData;
  }

  async authenticatorConfirm(
    user: User,
    session: Session,
    pin: string,
  ): Promise<OTP> {
    const otp = await this.otpService.getUserOTP(
      user,
      OTPProviders.AUTHENTICATOR,
      false,
    );
    if (otp.confirmed) {
      throw new BadRequestException(4102, 'OTP already confirmed');
    }
    const check = TOTP.verifyToken(otp.secret, pin);
    if (!check || check.delta !== 0) {
      throw new BadRequestException(4101, 'Code not valid');
    }
    otp.confirmed = true;
    otp.createdBy = session;
    return await this.otpService.updateUserOTP(otp);
  }

  authenticatorVerify(secret: string, code: string): boolean {
    const check = TOTP.verifyToken(secret, code);
    return !(!check || check.delta !== 0);
  }
}
