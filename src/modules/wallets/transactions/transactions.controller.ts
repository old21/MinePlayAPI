import { WalletsService } from '../wallets.service';
import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, EmailConfirmedGuard } from '../../users/auth/auth.guard';
import { TransactionsService } from './transactions.service';
import { UsersService } from '../../users/users.service';

@Controller('wallets/transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);
  constructor(
    private walletsService: WalletsService,
    private transactionsService: TransactionsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/')
  async transfer(
    @Req() request,
    @Res() res: Response,
    @Query('limit') limit: number,
  ) {
    const user = await this.usersService.getById(request.user.id);
    const wallet = await this.walletsService.getByUser(user);
    let transactions;
    if (limit) {
      transactions = await this.transactionsService.getHistory(wallet, limit);
    } else {
      transactions = await this.transactionsService.getHistory(wallet);
    }
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: transactions });
  }
}
