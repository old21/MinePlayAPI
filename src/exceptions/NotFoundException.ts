import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor() {
      super({ status: 4004, message: "Not found" }, HttpStatus.NOT_FOUND);
    }
}