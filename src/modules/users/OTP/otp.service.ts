import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './otp.entity';
import { User } from '../users.entity';
import { OTPProviders } from './otp.types';
import { Session } from '../sessions/sessions.entity';

@Injectable()
export class OTPService {
  constructor(@InjectRepository(OTP) private otpRepository: Repository<OTP>) {}

  async getUserOTP(
    user: User,
    provider: OTPProviders,
    isConfirmed: boolean = true,
    isExpired: boolean = false,
  ): Promise<OTP> {
    if (isConfirmed) {
      return await this.otpRepository.findOne({
        where: { user, provider, confirmed: isConfirmed, expired: isExpired },
      });
    }
    return await this.otpRepository.findOne({ where: { user, provider } });
  }

  async getUserActiveOTP(user: User): Promise<OTP[]> {
    return await this.otpRepository.find({
      where: { user, confirmed: true, expired: false },
      order: { provider: 'ASC' },
    });
  }

  async setUserOTP(
    user: User,
    provider: OTPProviders,
    session: Session,
    data: string = null,
  ) {
    switch (provider) {
      case OTPProviders.AUTHENTICATOR:
        const otp = this.otpRepository.create({
          user,
          provider,
          createdBy: session,
          secret: data,
        });
        return await this.otpRepository.save(otp);
    }
  }

  async updateUserOTP(otp: OTP): Promise<OTP> {
    return await this.otpRepository.save(otp);
  }

  async removeUserOTP(user: User, provider: OTPProviders, session: Session) {

  }
}
