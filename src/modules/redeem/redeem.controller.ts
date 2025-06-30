import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { OTPGuard } from '../users/OTP/otp.guard';
import { UsersService } from '../users/users.service';
import { RedeemService } from './redeem.service';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { WalletsService } from '../wallets/wallets.service';

@Controller('redeem')
export class RedeemController {
  private readonly logger = new Logger(RedeemController.name);
  constructor(
    private redeemService: RedeemService,
    private usersService: UsersService,
    private walletsService: WalletsService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Post('/create')
  async transfer(
    @Req() request,
    @Res() res: Response,
    @Body() dto: CreateRedeemDto,
  ) {
    const user = await this.usersService.getById(request.user.id);
    const query = await this.redeemService.create(user, dto);
    query.transaction.wallet = this.walletsService.unionCoins(
      query.transaction.wallet,
    );
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: query });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/my')
  async getMyRedeemCodes(@Req() request, @Res() res: Response) {
    const user = await this.usersService.getById(request.user.id);
    const redeem = await this.redeemService.getByUser(user);
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: redeem });
  }
}
