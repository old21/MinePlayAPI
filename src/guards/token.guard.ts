import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Token } from 'src/decorators/token.decorator';
import { ServiceKeyInvalidException } from 'src/exceptions/UnauthorizedException';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestToken = this.extractTokenFromHeader(request);
    const token = this.reflector.get(Token, context.getHandler());
    if(token !== requestToken) {
        throw new ServiceKeyInvalidException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}