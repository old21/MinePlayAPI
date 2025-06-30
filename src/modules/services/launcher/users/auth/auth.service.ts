import { AuthReport } from './auth.interfaces';
import { Injectable } from '@nestjs/common';
import { AuthorizeDto } from './dto/authorize.dto';
import { UsersService } from 'src/modules/users/users.service';
import { UsersService as UsersLauncherService } from '../users.service';
import * as argon2 from 'argon2';
import { User } from 'src/modules/users/users.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtLauncherKeypair } from 'src/helpers/keystore.helper';
import { JoinServerDto } from './dto/join-server.dto';
import { CheckServerDto } from './dto/check-server.dto';
import { HttpUser, HttpUserSession } from '../users.interfaces';
import {
  InvalidTokenException,
  TokenExpiredException,
  UnauthorizedException,
} from 'src/exceptions/UnauthorizedException';
import { BadRequestException } from 'src/exceptions/BadRequestException';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersLauncherSerice: UsersLauncherService,
    private jwtService: JwtService,
  ) {}

  async authorize(dto: AuthorizeDto) {
    const user = await this.usersService.getByLogin(dto.login, [
      'id',
      'isEmailConfirmed',
      'password',
      'name',
      'params',
      'avatar',
      'skin',
      'cloak',
    ]);

    if (
      !user ||
      !(await argon2.verify(user.password, dto.password.password)) ||
      !user.isEmailConfirmed
    ) {
      throw new UnauthorizedException();
    }

    return await this.authReport(user, dto.context.ip);
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthReport> {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        publicKey: JwtLauncherKeypair.public,
        ignoreExpiration: true,
      });

      const user = await this.usersService.getById(payload.id, [
        'id',
        'isEmailConfirmed',
        'password',
        'name',
        'params',
        'skin',
        'cloak',
        'avatar',
      ]);

      return await this.authReport(user, dto.context.ip);
    } catch (e) {
      throw new InvalidTokenException();
    }
  }

  async joinServer(dto: JoinServerDto): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(dto.accessToken, {
        publicKey: JwtLauncherKeypair.public,
      });

      if (!payload) {
        throw new InvalidTokenException();
      }

      const user = await this.usersService.getById(payload.id, [
        'id',
        'serverId',
      ]);
      // if(!user) {
      //     user = await this.usersService.getByLogin(dto.username);
      //     if(!user) {
      //         throw new UnauthorizedException();
      //     }
      // }

      await this.usersService.setServer(user, dto.serverId);
      return true;
    } catch (e) {
      switch (e.name) {
        case 'JsonWebTokenError':
          throw new InvalidTokenException();
        case 'TokenExpiredError':
          throw new TokenExpiredException(null);
        default:
          throw new InvalidTokenException();
      }
    }
  }

  async checkServer(dto: CheckServerDto): Promise<HttpUser> {
    const user = await this.usersService.getByName(dto.username, [
      'id',
      'name',
      'skin',
      'cloak',
      'avatar',
      'avatar',
      'params',
      'serverId',
    ]);

    if (!user || user.serverId !== dto.serverId) {
      throw new BadRequestException(4101, 'ServerId not valid.');
    }

    return this.usersLauncherSerice.HttpUser(user, null);
  }

  async authReport(user: User, ip: string): Promise<AuthReport> {
    const session = await this.usersLauncherSerice.HttpUserSession(user, ip);
    const report: AuthReport = {
      oauthAccessToken: session.user.accessToken,
      oauthExpire: 0,
      session: session,
    };

    return report;
  }

  async getByToken(token: string): Promise<HttpUserSession> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: JwtLauncherKeypair.public,
      });

      if (!payload) {
        throw new InvalidTokenException();
      }

      const user = await this.usersService.getById(payload.id, [
        'id',
        'isEmailConfirmed',
        'password',
        'name',
        'params',
        'skin',
        'cloak',
        'avatar',
      ]);

      return await this.usersLauncherSerice.HttpUserSession(
        user,
        null,
        payload.session,
      );
    } catch (e) {
      if (e.name === 'TokenExpired') {
        throw new TokenExpiredException(null);
      }
      throw new InvalidTokenException();
    }
  }
}
