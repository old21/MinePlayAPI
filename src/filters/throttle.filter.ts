import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ThrottleException } from 'src/exceptions/ThrottleException';

/**
 * Catch built-in nestJS throttler exception
 */
@Catch(ThrottlerException)
export class ThrottleErrorFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    response
      .status(status)
      .json({
        status: 4002,
        message: "Too many requests."
      });
  }
}

/**
 * Catch my throttle exception
 */
@Catch(ThrottleException)
export class MyThrottleErrorFilter implements ExceptionFilter {
  catch(exception: ThrottleException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const headers = exception.headers();
    response
      .status(status)
      .headers(headers)
      .json({
        status: 4002,
        message: "Too many requests."
      });
  }
}