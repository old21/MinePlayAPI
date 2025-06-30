import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpUser, HttpUserSession } from './users.interfaces';
import { User } from 'src/modules/users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService as UsersServiceGlobal } from 'src/modules/users/users.service';
import { TexturesService } from 'src/modules/users/textures/textures.service';
import { UserAssets } from './users.interfaces';
import { SessionsService } from 'src/modules/users/sessions/sessions.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private texturesService: TexturesService,
    private sessionsService: SessionsService,
    @InjectQueue('geoDetect') private geoDetectQueue: Queue,
  ) {}

  async HttpUser(user: User, token: string): Promise<HttpUser> {
    const textures = await Promise.all([
      this.texturesService.getUserSkin(user),
      this.texturesService.getUserCloak(user),
    ]);
    const avatar = await this.texturesService.getUserAvatar(user);
    const assets: UserAssets = {
      SKIN: {
        url: textures[0].url as string,
        digest: '',
        metadata: {
          model: textures[0].type as string,
        },
      },
      AVATAR: {
        url: avatar.image as string,
        digest: '',
      },
    };

    if (textures[1] !== null) {
      assets.CAPE = {
        url: textures[1].url as string,
        digest: '',
      };
    }
    return {
      username: user.name,
      uuid: user.id,
      accessToken: token,
      assets,
    };
  }

  async HttpUserSession(
    user: User,
    ip: string,
    sessionId: string = null,
  ): Promise<HttpUserSession> {
    let session;
    if (sessionId === null) {
      const activeSessions = await this.sessionsService.getByUser(user);
      for (let i = 0; i < activeSessions.length; i++) {
        if (
          activeSessions[i].ip == ip &&
          activeSessions[i].device == 'PC' &&
          activeSessions[i].place == 'Launcher'
        ) {
          session = activeSessions[i];
          this.sessionsService.update(session);
          break;
        }
      }
      if (session === undefined) {
        session = await this.sessionsService.create({
          ip: ip,
          device: 'PC',
          place: 'Launcher',
          user: user,
          country: 0,
          city: 0,
        });
        this.geoDetectQueue.add('getLocation', { session, ip });
      }
    } else {
      session = await this.sessionsService.getById(sessionId);
    }

    const payload = { id: user.id, session: session.id };
    const token = await this.jwtService.signAsync(payload);

    return {
      id: session.id,
      user: await this.HttpUser(user, token),
      expireIn: 0,
    };
  }
}
