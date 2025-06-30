import { UsersService } from '../users.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  EmailNotConfirmedException,
  InvalidTokenException,
  SessionExpiredException,
  TokenExpiredException,
  UnauthorizedException,
} from '../../../exceptions/UnauthorizedException';
import { Request } from 'express';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(SessionsService) private sessionsService: SessionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token || !request.headers.session) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        ignoreExpiration: true,
      });
      if (payload.session != request.headers.session) {
        throw new UnauthorizedException();
      }

      const session = await this.sessionsService.getById(
        request.headers.session,
      ); // Get current session
      if (!session || session.expired == true) {
        // <---- Check session availability
        throw new SessionExpiredException();
      }
      this.sessionsService.update(session); // Update session last-used time

      if (payload.exp <= Math.round(new Date().getTime() / 1000)) {
        const refreshedToken = await this.jwtService.signAsync({
          id: payload.id,
          session: payload.session,
        });
        throw new TokenExpiredException(refreshedToken);
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      return true;
    } catch (e) {
      switch (e.name) {
        case 'JsonWebTokenError':
          throw new InvalidTokenException();
        default:
          throw e;
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class EmailConfirmedGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersService.getById(request.user.id, [
      'isEmailConfirmed',
    ]);
    if (!user.isEmailConfirmed) {
      throw new EmailNotConfirmedException();
    }
    return true;
  }
}
