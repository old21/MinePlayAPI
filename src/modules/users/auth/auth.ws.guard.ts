import { UsersService } from '../users.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from '../sessions/sessions.service';
import { Socket } from '../../../interfaces/socket.interface';
import {
  WSEmailNotConfirmedException,
  WSInvalidTokenException,
  WSSessionExpiredException,
  WSTokenExpiredException,
  WSUnauthorizedException,
} from '../../../exceptions/websocket/UnauthorizedException';

@Injectable()
export class WSAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(SessionsService) private sessionsService: SessionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    const token = client.handshake.headers.token as string;
    const sessionId = client.handshake.headers.session as string;
    if (!token || !sessionId) {
      throw new WSUnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        ignoreExpiration: true,
      });
      if (payload.session != sessionId) {
        throw new WSUnauthorizedException();
      }

      const session = await this.sessionsService.getById(sessionId); // Get current session
      if (!session || session.expired === true) {
        // <---- Check session availability
        throw new WSSessionExpiredException();
      }
      this.sessionsService.update(session); // Update session last-used time

      if (payload.exp <= Math.round(new Date().getTime() / 1000)) {
        const refreshedToken = await this.jwtService.signAsync({
          id: payload.id,
          session: payload.session,
        });
        throw new WSTokenExpiredException(refreshedToken);
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      client.user = payload;
      return true;
    } catch (e) {
      switch (e.name) {
        case 'JsonWebTokenError':
          throw new WSInvalidTokenException();
        default:
          throw e;
      }
    }
  }
}

@Injectable()
export class WSEmailConfirmedGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getClient();

    const user = await this.usersService.getById(request.user.id, [
      'isEmailConfirmed',
    ]);
    if (!user.isEmailConfirmed) {
      throw new WSEmailNotConfirmedException();
    }
    return true;
  }
}
