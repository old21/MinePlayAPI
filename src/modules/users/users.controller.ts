import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard, EmailConfirmedGuard } from './auth/auth.guard';
import { RolesService } from '../roles/roles.service';
import { TexturesService } from './textures/textures.service';
import { WalletsService } from '../wallets/wallets.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private rolesService: RolesService,
    private walletService: WalletsService,
    private texturesService: TexturesService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  /**
   * Select values: 'id', 'name', 'level', 'exp', 'avatar', 'skin', 'cloak', 'lastLogin', 'createdAt', 'role', 'banner', 'avatar', 'params'
   */
  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/me')
  async me(@Req() request, @Res() res: Response) {
    const user = await this.userService.getById(request.user.id, [
      'id',
      'name',
      'level',
      'exp',
      'avatar',
      'skin',
      'cloak',
      'lastLogin',
      'createdAt',
      'role',
      'banner',
      'avatar',
      'params',
    ]);
    const avatar = await this.texturesService.getUserAvatar(user);
    const userSpecial = await Promise.all([
      this.walletService.getByUser(user, true),
      this.texturesService.getUserSkin(user),
      this.texturesService.getUserCloak(user),
      this.texturesService.getUserBanner(user),
      await this.rolesService.getByUser(user),
      await this.subscriptionsService.getUserActiveSubscription(user),
    ]);
    user.avatar = avatar;
    user.wallet = userSpecial[0];
    user.skin = userSpecial[1];
    user.cloak = userSpecial[2];
    user.banner = userSpecial[3];
    user.role = userSpecial[4];
    // user.subscription = userSpecial[5];
    delete user.params;
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: user });
  }
}
