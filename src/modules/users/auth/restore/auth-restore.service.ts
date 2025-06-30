import { Injectable } from '@nestjs/common';
import { BadRequestException } from '../../../../exceptions/BadRequestException';
import { EmailTypes } from '../../../verify/verify.types';
import { VerifyService } from '../../../verify/verify.service';
import { RestoreVerifyDto } from './dto/restore-verify.dto';
import { User } from '../../users.entity';
import { UsersService } from '../../users.service';
import { PasswordHelper } from '../../../../helpers/password.helper';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthRestoreService {
  constructor(
    private confirmationsService: VerifyService,
    private usersService: UsersService,
    @InjectQueue('emailSendings') private emailQueue: Queue,
  ) {}

  async sendEmail(user: User) {
    await this.confirmationsService.generate(EmailTypes.PasswordReset, user);
  }

  async verify(user: User, dto: RestoreVerifyDto) {
    const verify = await this.confirmationsService.verify(
      EmailTypes.PasswordReset,
      user,
      dto,
    );

    if (!verify) {
      throw new BadRequestException(4102, 'Code invalid');
    }

    const password = PasswordHelper.generatePassword();

    this.emailQueue.add('new-password', {
      to: user.email,
      context: {
        password,
        name: user.name,
        assetPath: process.env.S3_URL,
      },
    });
    await this.usersService.changePassword(user, password);
  }
}
