import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { IncidentsService } from 'src/modules/incidents/incidents.service';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from '../interfaces/socket.interface';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private incidentsService: IncidentsService) {}

  async catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const req = host.switchToHttp().getRequest();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // console.log(error)
    // if (status === HttpStatus.UNAUTHORIZED) {
    //   return response.status(status).json({ status: 403 });
    //   throw new UnauthorizedException();
    // }
    // if (status === HttpStatus.NOT_FOUND) {
    //   return response.status(status).json({ status: 404 });
    //   throw new NotFoundException();
    // }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const incident = await this.incidentsService.register(
        error.stack,
        req.ip,
      );
      console.error(error.stack);
      return response
        .status(status)
        .json({ status: 5000, IncidentID: incident.id });
    }

    if (error instanceof HttpException) {
      // set httpException res to res
      response.status(error.getStatus()).json(error.getResponse());
      return;
    }
  }
}

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();
    let details;
    if (error instanceof Object) {
      details = { ...error };
      if (!details.event) {
        client.emit(`error`, { ...details });
        return;
      }
      client.emit(`${details.event}Callback`, { ...details });
    } else {
      details = { message: error };
      client.emit(`error`, { ...details });
    }
  }
}
