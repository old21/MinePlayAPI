import { HttpException, HttpStatus } from '@nestjs/common';

export class NotEnoughException extends HttpException {
  constructor() {
    super(
      { status: 4012, message: 'Недостаточно средств!' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
