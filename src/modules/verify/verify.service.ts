import { Injectable } from '@nestjs/common';
import { Confirmation } from './verify.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { ThrottleException } from 'src/exceptions/ThrottleException';
import { EmailTypes } from './verify.types';
import { RestoreVerifyDto } from '../users/auth/restore/dto/restore-verify.dto';

@Injectable()
export class VerifyService {
  constructor(
    @InjectRepository(Confirmation)
    private confirmationsRepository: Repository<Confirmation>,
    @InjectQueue('emailSendings') private emailQueue: Queue,
  ) {}

  async getById(id: string): Promise<Confirmation> {
    return await this.confirmationsRepository.findOne({ where: { id } });
  }
  /**
   * Compare request code and code in DB
   * @param user User instance
   * ERRORS: 4101 - User hasn't got any confirmation codes
   *         4102 - Code has been expired
   *         4103 - Invalid code
   */
  async verify(
    type: EmailTypes,
    user: User,
    dto: VerifyCodeDto | RestoreVerifyDto,
  ): Promise<Confirmation> {
    const activeCode = await this.confirmationsRepository.findOne({
      where: { user, type },
    });
    if (activeCode) {
      if (
        activeCode.createdAt + 3600 <=
        Math.round(new Date().getTime() / 1000)
      ) {
        // <----  If code has been expired
        //return { code: 4102 };
        throw new BadRequestException(4102, 'Code has been expired');
      } else {
        // <---- If code is up-to-date
        if (Number(activeCode.code) === Number(dto.code)) {
          this.confirmationsRepository.remove(activeCode);
          return activeCode;
        }
        //return { code: 4103 };
        throw new BadRequestException(4103, 'Invalid code');
      }
    }
    //return { code: 4101 };
    throw new BadRequestException(
      4101,
      "User hasn't got any confirmation codes",
    );
  }

  /**
   * Generate a code
   * @param type for "email" / "password" or "OTP"
   * @param user User instance
   * @param email If you want to send a code to custom email
   * @param otpMessage TOTP auth can be sent with custom message
   * ERRORS: nope.
   */
  async generate(
    type: EmailTypes,
    user: User,
    email: string = null,
    otpMessage: string = null,
  ): Promise<Confirmation> {
    let processName;
    switch (type) {
      case EmailTypes.AccountConfirm:
        processName = 'account-confirmation';
        break;
      case EmailTypes.PasswordReset:
        processName = 'password-reset';
        break;
      case EmailTypes.OTP:
        processName = 'otp';
        break;
      case EmailTypes.ChangeEmail:
        processName = 'new-email';
        break;
    }
    const code = this.code();
    if (!email) {
      email = user.email;
    }
    this.emailQueue.add(processName, {
      to: email,
      context: {
        code: String(code).split(''),
        name: user.name,
        message: otpMessage,
        assetPath: process.env.S3_URL,
      },
    });
    const activeCodes = await this.confirmationsRepository.find({
      where: { user, type },
    });
    if (activeCodes) {
      for (const item of activeCodes) {
        if (
          Number(item.createdAt) + 60 >=
          Math.round(new Date().getTime() / 1000)
        ) {
          return item;
        }
        await this.confirmationsRepository.remove(item);
      }
    }
    const newCode = this.confirmationsRepository.create({
      code,
      user,
      type,
      email,
    });
    return await this.confirmationsRepository.save(newCode);
  }

  /**
   * Compare request code and code in DB
   * @param user User instance
   * ERRORS: 4101 - User hasn't got any confirmation codes
   *         4102 - Code has been expired
   *         4103 - Invalid code
   */
  async regenerate(
    type: EmailTypes,
    user: User,
    silent: boolean = false,
  ): Promise<boolean> {
    let processName;
    switch (type) {
      case EmailTypes.AccountConfirm:
        processName = 'account-confirmation';
        break;
      case EmailTypes.PasswordReset:
        processName = 'password-reset';
        break;
    }
    const activeCode = await this.confirmationsRepository.findOne({
      where: { user: user, type },
    });
    const code = this.code();
    if (activeCode) {
      if (
        Number(activeCode.createdAt) + 60 >=
        Math.round(new Date().getTime() / 1000)
      ) {
        // Trottling 1 code = 1 minute
        if (!silent) {
          throw new ThrottleException(
            Number(activeCode.createdAt) +
              60 -
              Math.round(new Date().getTime() / 1000),
          );
        }
      } else {
        activeCode.code = code;
        activeCode.createdAt = Math.round(new Date().getTime() / 1000);
        this.confirmationsRepository.save(activeCode); // TODO NOT WORK!
      }
    } else {
      const newCode = await this.confirmationsRepository.create({
        code,
        user,
        type,
      });
      this.confirmationsRepository.save(newCode);
    }
    this.emailQueue.add(processName, {
      to: user.email,
      context: {
        code: String(code).split(''),
        assetPath: process.env.S3_URL,
        name: user.name,
      },
    });
    return true;
  }

  private code(): number {
    return Math.round(Math.random() * (99999 - 10000) + 10000);
  }
}
