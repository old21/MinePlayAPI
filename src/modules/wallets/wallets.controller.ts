import { WalletsService } from './wallets.service';
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
import { RobokassaService } from 'src/services/payments/robokassa.service';
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { UsersService } from '../users/users.service';
import { PaymentMethod, PaymentObject, PaymentTax } from 'robokassa-node';
import { ReplenishWalletDto } from './dto/replenish-wallet.dto';
import { OrdersService } from './orders/orders.service';
import { ExchangeWalletDto } from './dto/exchange-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';
import { BadRequestException } from '../../exceptions/BadRequestException';
import { TransactionsService } from './transactions/transactions.service';
import { ReplenishTypes } from './wallets.types';
import { OTPGuard } from '../users/OTP/otp.guard';

@Controller('wallets')
export class WalletController {
  constructor(
    private robokassaService: RobokassaService,
    private userService: UsersService,
    private ordersService: OrdersService,
    private walletsService: WalletsService,
    private usersService: UsersService,
    private transactionsService: TransactionsService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard, OTPGuard)
  @Post('/transfer')
  async transfer(
    @Req() request,
    @Res() res: Response,
    @Body() dto: TransferWalletDto,
  ) {
    const sender = await this.userService.getById(request.user.id);

    const receiver = await this.userService.getByLogin(dto.receiver, [
      'id',
      'name',
    ]);
    if (!receiver) {
      throw new BadRequestException(4101, 'Получатель не найден!');
    }
    if (receiver.name === sender.name) {
      throw new BadRequestException(
        4102,
        'Вы не можете перевести деньги самому себе!',
      );
    }

    const transaction = await this.walletsService.transfer(
      sender,
      receiver,
      dto.amount,
    );
    delete transaction.receiver;
    delete transaction.exchangeTo;
    transaction.wallet = this.walletsService.unionCoins(transaction.wallet);
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: transaction });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Post('/replenish')
  async replenish(
    @Req() request,
    @Res() res: Response,
    @Body() dto: ReplenishWalletDto,
  ) {
    const user = await this.userService.getById(
      request.user.id,
      {
        id: true,
        email: true,
        name: true,
        invitedBy: { id: true, earned: true },
      },
      { relations: { invitedBy: true } },
    );
    const item = {
      name: `Монеты`,
      quantity: dto.amount,
      sum: `${Number(process.env.ECONOMY_MONEY_COST) * dto.amount}.00`,
      tax: PaymentTax.NONE,
      payment_method: PaymentMethod.FULL_PREPAYMENT,
      payment_object: PaymentObject.COMMODITY,
    };
    const order = await this.ordersService.create(
      Number(process.env.ECONOMY_MONEY_COST) * dto.amount,
      dto.amount,
      user,
    );
    const query = await this.walletsService.replenish(
      user,
      dto.amount,
      ReplenishTypes.PURCHASE,
    );
    query.wallet.coins = query.wallet.realcoins + query.wallet.gamecoins;
    delete query.wallet.realcoins;
    delete query.wallet.gamecoins;
    const redirectUrl = await this.robokassaService.getPaymentLink(
      Number(process.env.ECONOMY_MONEY_COST) * dto.amount,
      order.id,
      user.email,
      `Приобретение ${dto.amount} монет на счёт игрока ${user.name}`,
      item,
    );
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { redirectUrl, wallet: query.wallet, role: query.role },
    });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Post('/exchange')
  async exchange(
    @Req() request,
    @Res() res: Response,
    @Body() dto: ExchangeWalletDto,
  ) {
    const user = await this.userService.getById(request.user.id, [
      'email',
      'name',
      'id',
    ]);

    // const order = await this.ordersService.create((Number(process.env.ECONOMY_MONEY_COST) * dto.amount), dto.amount, user);
    const wallet = await this.walletsService.exchange(
      user,
      dto.bill,
      dto.amount,
    );
    wallet.coins = wallet.realcoins + wallet.gamecoins;
    delete wallet.realcoins;
    delete wallet.gamecoins;
    // const redirectUrl = await this.robokassaService.getPaymentLink((Number(process.env.ECONOMY_MONEY_COST) * dto.amount), order.id, user.email, `Приобретение ${dto.amount} монет на счёт игрока ${user.name}`, item)
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { wallet } });
  }
}
