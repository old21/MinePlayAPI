import { HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class BadRequestException extends HttpException {
  constructor(status: number, message: string) {
    super({ status, message }, HttpStatus.BAD_REQUEST);
  }
}

export class WSBadRequestException extends WsException {
  constructor(event: string, status: number, message: string) {
    super({ event, status, message });
  }
}
