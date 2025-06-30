import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('emailSendings')
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('account-confirmation')
  async sendWelcomeEmail(job: Job) {
    const { data } = job;
    try {
      await this.mailService.sendMail({
        ...data,
        subject: `${process.env.APP_NAME} | Подтверждение аккаунта`,
        template: 'AccountConfirm',
      });
    } catch (e) {
      console.log(e);
    }
  }

  @Process('new-password')
  async sendNewPassword(job: Job) {
    const { data } = job;
    try {
      await this.mailService.sendMail({
        ...data,
        subject: `${process.env.APP_NAME} | Новый пароль`,
        template: 'NewPassword',
      });
    } catch (e) {
      console.log(e);
    }
  }

  @Process('new-email')
  async sendNewEmail(job: Job) {
    const { data } = job;
    try {
      await this.mailService.sendMail({
        ...data,
        subject: `${process.env.APP_NAME} | Смена почты`,
        template: 'NewEmail',
      });
    } catch (e) {
      console.log(e);
    }
  }

  @Process('password-reset')
  async sendResetPasswordEmail(job: Job) {
    const { data } = job;
    await this.mailService.sendMail({
      ...data,
      subject: `${process.env.APP_NAME} | Сброс пароля`,
      template: 'PasswordReset',
    });
  }

  @Process('otp')
  async sendOTPEmail(job: Job) {
    const { data } = job;
    await this.mailService.sendMail({
      ...data,
      subject: `${process.env.APP_NAME} | Подтверждение действия`,
      template: 'OTPConfirm',
    });
  }
}
