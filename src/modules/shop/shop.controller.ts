import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PurchaseItemDto } from './dto/purchase-item.dto';
import { ShopService } from './shop.service';
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '../../exceptions/BadRequestException';

@Controller('/shop')
export class ShopController {
  constructor(
    private shopService: ShopService,
    private usersService: UsersService,
  ) {}
  @Post('/purchase')
  @UseGuards(AuthGuard, EmailConfirmedGuard)
  async purchase(
    @Res() res: Response,
    @Body() dto: PurchaseItemDto,
    @Req() request,
  ) {
    const user = await this.usersService.getById(request.user.id);

    const item = await this.shopService.getById(dto.itemId);
    if (!item) {
      throw new BadRequestException(4104, 'Shop item not found!');
    }
    const transaction = await this.shopService.purchaseItem(
      item,
      user,
      dto.bill,
    );
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { transaction, item } });
  }
}
