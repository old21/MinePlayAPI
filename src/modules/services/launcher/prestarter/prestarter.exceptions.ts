import { HttpException, HttpStatus } from "@nestjs/common";

export class OSNotSupportedException extends HttpException {
    constructor() {
      super({ status: 4010, message: "Ваша OS не поддерживается!" }, HttpStatus.BAD_REQUEST);
    }
}

export class ArchNotSupportedException extends HttpException {
    constructor() {
      super({ status: 4011, message: "Архитектура вашего процессора пока что не поддерживается!" }, HttpStatus.BAD_REQUEST);
    }
}