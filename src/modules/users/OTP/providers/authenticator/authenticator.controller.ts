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
import { OTPService } from '../../otp.service';
import { UsersService } from 'src/modules/users/users.service';
import {
  AuthGuard,
  EmailConfirmedGuard,
} from 'src/modules/users/auth/auth.guard';
import { AuthenticatorService } from './authenticator.service';
import { OTPGuard } from "../../otp.guard";

@Controller('users/otp/authenticator')
export class AuthenticatorController {
  constructor(
    private otpService: OTPService,
    private authenticatorService: AuthenticatorService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard, OTPGuard)
  @Get('generate')
  async generateAuthenticatorSecret(@Req() request, @Res() res: Response) {
    const user = await this.usersService.getById(request.user.id);
    const totpData =
      await this.authenticatorService.generateAuthenticatorSecret(
        user,
        request.user.session,
      );

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: totpData });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('confirm/:pin')
  async authenticatorConfirm(
    @Param('pin') pin,
    @Req() request,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getById(request.user.id);
    await this.authenticatorService.authenticatorConfirm(
      user,
      request.user.session,
      pin,
    );

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
  }
}
