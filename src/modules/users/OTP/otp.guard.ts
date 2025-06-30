import { UsersService } from '../users.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { OTPService } from './otp.service';
import {
  NeedTwoFactorAuthException,
  TwoFactorInvalidException,
  UnauthorizedException,
} from '../../../exceptions/UnauthorizedException';
import * as argon2 from 'argon2';
import { OTPProviders } from './otp.types';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { AuthenticatorService } from './providers/authenticator/authenticator.service';
import { EmailService } from './providers/email/email.service';
import { EmailHelper } from '../../../helpers/email.helper';

@Injectable()
export class OTPGuard implements CanActivate {
  constructor(
    private otpService: OTPService,
    private authenticatorService: AuthenticatorService,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const otpCode = request.headers.otpcode;
    const otpType = Number(request.headers.otptype);
    const user = await this.usersService.getById(request.user.id, [
      'id',
      'name',
      'email',
    ]);
    const otp = await this.otpService.getUserActiveOTP(user);
    if (!otpCode) {
      if (otp.length === 0) {
        //No available OTP methods. Use Email confirm
        this.emailService.sendCode(user, 'TEST');
      }
      throw new NeedTwoFactorAuthException(
        otp,
        EmailHelper.obusficate(user.email),
      );
    }

    if (otp.length === 0) {
      const check = await this.emailService.verify(user, otpCode);
      if (!check) {
        throw new TwoFactorInvalidException();
      }
      return true;
    }

    const checkTypeAvailabiliy = otp.find(
      ({ provider }) => provider === otpType,
    );
    if (!checkTypeAvailabiliy) {
      throw new BadRequestException(4000, 'Invalid OTP Type!');
    }
    switch (otpType) {
      case OTPProviders.AUTHENTICATOR:
        const verify = this.authenticatorService.authenticatorVerify(
          otp[0].secret,
          otpCode,
        );
        if (!verify) {
          throw new TwoFactorInvalidException();
        }
        return true;
      default:
        return false;
    }
  }
}
