import { Body, Controller, Post, HttpStatus, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthRestoreService } from './auth-restore.service';
import { RestoreAuthDto } from './dto/restore-auth.dto';
import { Throttle } from '@nestjs/throttler';
import { RestoreVerifyDto } from './dto/restore-verify.dto';
import { UsersService } from '../../users.service';
import { BadRequestException } from '../../../../exceptions/BadRequestException';

@Controller('auth/restore')
export class AuthRestoreController {
  constructor(
    private authRestoreService: AuthRestoreService,
    private usersService: UsersService,
  ) {}

  @Post('/')
  @Throttle({ default: { limit: 3, ttl: 15000 } })
  async restore(
    @Req() request,
    @Body() dto: RestoreAuthDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getByEmail(dto.email, [
      'id',
      'name',
      'email',
    ]);

    if (!user) {
      throw new BadRequestException(4101, 'User not found');
    }

    await this.authRestoreService.sendEmail(user);

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
  }

  @Post('/verify')
  @Throttle({ default: { limit: 3, ttl: 15000 } })
  async restoreVerify(
    @Req() request,
    @Body() dto: RestoreVerifyDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getByEmail(dto.email, [
      'id',
      'name',
      'email',
    ]);

    if (!user) {
      throw new BadRequestException(4101, 'User not found');
    }
    await this.authRestoreService.verify(user, dto);

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
  }
}
