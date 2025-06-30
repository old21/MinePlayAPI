import {
  Body,
  Controller,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { OTPService } from './otp.service';
import { AuthGuard, EmailConfirmedGuard } from '../auth/auth.guard';
import { UsersService } from '../users.service';

@Controller('users/otp')
export class OtpController {
  constructor(
    private otpService: OTPService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('available')
  async getAvailableOTP(@Req() request, @Res() res: Response) {
    const user = await this.usersService.getById(request.user.id);
    const otp = await this.otpService.getUserActiveOTP(user);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: otp.map(({ provider }) => provider),
    });
  }
}
