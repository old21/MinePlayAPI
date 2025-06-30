import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { UsersService } from '../users/users.service';
import { ReferalsService } from './referals.service';
import { BadRequestException } from 'src/exceptions/BadRequestException';

@Controller('referals')
export class ReferalsController {
  constructor(
    private userService: UsersService,
    private referalsService: ReferalsService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/register')
  async registerReferal(@Req() request, @Res() res: Response) {
    const user = await this.userService.getById(request.user.id, ['id']);
    if ((await this.referalsService.getByUser(user)) != null) {
      throw new BadRequestException(4101, 'User already has a referal!');
    }
    const referal = await this.referalsService.register(user);
    delete referal.user;
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: referal });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/my')
  async getMyReferal(@Req() request, @Res() res: Response) {
    const user = await this.userService.getById(request.user.id, ['id']);
    const referal = await this.referalsService.getByUser(user);
    if (!referal) {
      throw new BadRequestException(4101, "User hasn't got any referals!");
    }
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: referal });
  }

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Get('/users')
    async getMyUsers(@Req() request, @Res() res: Response) {
        const user = await this.userService.getById(request.user.id, ['id']);
        const referal = await this.referalsService.getByUser(user);
        if (!referal) {
            throw new BadRequestException(4101, "User hasn't got any referals!");
        }
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: referal });
    }

  @Get('/checkReferalAvailability/:name')
  async checkReferalAvailability(@Param('name') name, @Res() res: Response) {
    const referal = await this.referalsService.getByName(name);
    if (!referal) {
      throw new BadRequestException(4101, 'Referal not found');
    }
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, referal });
  }
}
