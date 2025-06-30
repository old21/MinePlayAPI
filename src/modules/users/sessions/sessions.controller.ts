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
import { UsersService } from '../users.service';
import {
  AuthGuard,
  EmailConfirmedGuard,
} from 'src/modules/users/auth/auth.guard';
import { SessionsService } from './sessions.service';

@Controller('users/security/sessions')
export class SessionsController {
  constructor(
    private userService: UsersService,
    private sessionsService: SessionsService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/active')
  async getUserActiveSessions(@Req() request, @Res() res: Response) {
    const user = await this.userService.getById(request.user.id, ['id']);
    const sessions = await this.sessionsService.getUserActive(user);

    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].id === request.user.session) {
        sessions[i].isCurrent = true;
        break;
      }
    }

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: sessions });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/kill/all')
  async killAllUserSessions(@Req() request, @Res() res: Response) {
    const user = await this.userService.getById(request.user.id, ['id']);
    const sessions = await this.sessionsService.getByUser(user);
    await this.sessionsService.destroy(sessions);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
  }

  // This method for Logout action
  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Get('/kill/current')
  async killCurentUserSession(@Req() request, @Res() res: Response) {
    const session = await this.sessionsService.getCurrent(request.user.session);
    await this.sessionsService.destroy(session);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
  }
}
