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
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { UsersService } from '../users/users.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('/subscriptions')
export class SubscriptionsController {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private usersService: UsersService,
  ) {}
  @Get('/my')
  @UseGuards(AuthGuard, EmailConfirmedGuard)
  async activeSubscriptions(@Res() res: Response, @Req() request) {
    const user = await this.usersService.getById(request.user.id);

    const subscriptions =
      await this.subscriptionsService.getUserActiveSubscription(user);

    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: subscriptions });
  }

  @Get('/list')
  async list(@Res() res: Response) {
    const subscriptions =
      await this.subscriptionsService.getSubscriptionsList();

    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: subscriptions });
  }

  @Post('/create')
  async create(@Res() res: Response, @Body() dto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionsService.create(dto);
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: subscription });
  }
}
