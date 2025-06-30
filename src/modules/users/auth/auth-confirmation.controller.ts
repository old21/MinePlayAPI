import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { VerifyService } from '../../verify/verify.service';
import { UsersService } from '../users.service';
import { Throttle } from '@nestjs/throttler';
import { ReferalsService } from 'src/modules/referals/referals.service';
import { EmailTypes } from 'src/modules/verify/verify.types';
import { BadRequestException } from "../../../exceptions/BadRequestException";

@Controller('auth/confirm')
export class AuthConfirmController {
  constructor(
    private verifyService: VerifyService,
    private usersService: UsersService,
    private referalsService: ReferalsService,
  ) {}

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @UseGuards(AuthGuard)
  @Post('resend')
  async emailResend(@Req() request, @Body() body) {
    const user = await this.usersService.getById(request.user.id);
    return this.verifyService.regenerate(EmailTypes.AccountConfirm, user, body);
  }

  @Throttle({ default: { limit: 3, ttl: 30000 } })
  @UseGuards(AuthGuard)
  @Post('pin')
  async emailVerify(@Req() request, @Body() body) {
    const user = await this.usersService.getById(request.user.id);
    const verify = await this.verifyService.verify(
      EmailTypes.AccountConfirm,
      user,
      body,
    );
    if (verify) {
      const referal = await this.referalsService.getByUser(user);
      if (referal) {
        this.referalsService.addInvite(referal);
      }
      this.usersService.emailConfirm(user);
      return {
        status: HttpStatus.OK,
      };
    }

    throw new BadRequestException(4101, 'Code invalid');
  }
}
