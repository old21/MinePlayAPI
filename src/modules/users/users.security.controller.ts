import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard, EmailConfirmedGuard } from './auth/auth.guard';
import { dateInterval } from 'src/helpers/language.helper';
import { ChangePasswordDto } from './dto/change-password.dto';
import { OTPGuard } from './OTP/otp.guard';
import { ChangeEmailDto } from './dto/change-email.dto';
import { VerifyService } from '../verify/verify.service';
import { EmailTypes } from '../verify/verify.types';
import { BadRequestException } from '../../exceptions/BadRequestException';
import { VerifyCodeDto } from '../verify/dto/verify-code.dto';

@Controller('users/security')
export class UsersSecurityController {
  constructor(
    private userService: UsersService,
    private confirmationsService: VerifyService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/passwordLastChange')
  async getPasswordLastChange(@Req() request, @Res() res: Response) {
    const user = await this.userService.getById(request.user.id, [
      'passwordReset_at',
    ]);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        unix: user.passwordReset_at,
        human: dateInterval(user.passwordReset_at),
      },
    });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard, OTPGuard)
  @Post('/changePassword')
  async changePassword(
    @Req() request,
    @Res() res: Response,
    @Body() dto: ChangePasswordDto,
  ) {
    const user = await this.userService.getById(request.user.id, [
      'id',
      'password',
      'passwordReset_at',
    ]);
    const change = await this.userService.changePassword(user, dto.password);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        passwordReset_at: change.passwordReset_at,
        human: dateInterval(change.passwordReset_at),
      },
    });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard, OTPGuard)
  @Post('/changeEmail')
  async changeEmail(
    @Req() request,
    @Res() res: Response,
    @Body() dto: ChangeEmailDto,
  ) {
    const check = await this.userService.getByEmail(dto.email);
    if (check) {
      throw new BadRequestException(4101, 'Данный email уже используется!');
    }
    const user = await this.userService.getById(request.user.id, [
      'id',
      'email',
      'name',
    ]);
    const confirmation = await this.confirmationsService.generate(
      EmailTypes.ChangeEmail,
      user,
      dto.email,
    );
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { confirmationId: confirmation.id },
    });
  }
  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Post('/changeEmail/confirm')
  async changeEmailConfirm(
    @Req() request,
    @Res() res: Response,
    @Body() dto: VerifyCodeDto,
  ) {
    const user = await this.userService.getById(request.user.id, [
      'id',
      'email',
    ]);

    const confirmation = await this.confirmationsService.verify(
      EmailTypes.ChangeEmail,
      user,
      dto,
    );
    await this.userService.changeEmail(user, confirmation.email);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
    });
  }
}
