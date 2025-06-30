import { HttpException, HttpStatus } from "@nestjs/common";



export class ThrottleException extends HttpException {
    retryTime;
    constructor(retryTime: number) {
      super({ status: 4021, message: "Too many requests." }, HttpStatus.TOO_MANY_REQUESTS);
      this.retryTime = retryTime;
    }
    headers() {
      return { 'Retry-After': this.retryTime };
    }
  }