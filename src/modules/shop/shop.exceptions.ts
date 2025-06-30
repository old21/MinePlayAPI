import { HttpException, HttpStatus } from '@nestjs/common';

export class VaultNotAvailable extends HttpException {
  constructor() {
    super(
      {
        status: 4101,
        message: 'Данный предмет нельзя купить за данную валюту!',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ItemLimitExceeded extends HttpException {
  constructor() {
    super(
      {
        status: 4102,
        message: 'Предмета нет на складе!',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
