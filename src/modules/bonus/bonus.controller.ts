import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, EmailConfirmedGuard } from '../users/auth/auth.guard';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { BonusesService } from './bonus.service';
import { Projects } from './bonus.types';

@Controller('bonus')
export class BonusesController {
  constructor(
    private bonusesService: BonusesService,
    private usersService: UsersService,
  ) {}
  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/get/:email')
  async getById(
    @Res() res: Response,
    @Param('email') email: string,
    @Req() request,
  ) {
    const bonuses = await this.bonusesService.getBonus(email);

    //const user = await this.usersService.getById(request.user.id);

    const projects: Projects[] = [];

    bonuses.forEach((bonus) => {
      projects.push(bonus.projectId);
    });
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: projects,
    });
  }
}
