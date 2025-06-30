import { WsException } from '@nestjs/websockets';

export class WSUnauthorizedException extends WsException {
  constructor() {
    super({ status: 4011, message: 'Unauthorized.' });
  }
}

export class WSSessionExpiredException extends WsException {
  constructor() {
    super({ status: 4012, message: 'Session has been expired.' });
  }
}

export class WSTokenExpiredException extends WsException {
  constructor(token: string) {
    if (token) {
      super({
        status: 4013,
        message: 'Token has been refreshed.',
        tokenType: 'Bearer',
        token: token,
      });
      return;
    }
    super({ status: 4013, message: 'Token has been refreshed.' });
  }
}

export class WSEmailNotConfirmedException extends WsException {
  constructor() {
    super({ status: 4014, message: 'Email not confirmed.' });
  }
}

export class WSNeedTwoFactorAuthException extends WsException {
  constructor(availableOTP) {
    super({
      status: 4015,
      message: 'Need OTP auth.',
      data: { availableOTP: availableOTP.map(({ provider }) => provider) },
    });
  }
}

export class WSTwoFactorInvalidException extends WsException {
  constructor() {
    super({ status: 4016, message: 'Two factor authentication failed.' });
  }
}

export class WSNotRegisteredException extends WsException {
  constructor() {
    super({ status: 4017, message: 'User with current email not found.' });
  }
}

export class WSServiceKeyInvalidException extends WsException {
  constructor() {
    super({ status: 4018, message: 'Unauthorized.' });
  }
}

export class WSInvalidTokenException extends WsException {
  constructor() {
    super({ status: 4019, message: 'Invalid token.' });
  }
}
