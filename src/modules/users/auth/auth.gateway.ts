import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket } from '../../../interfaces/socket.interface';
import { WebsocketExceptionsFilter } from '../../../filters/error.filter';

@WebSocketGateway(8080, {
  namespace: '/',
  cors: {
    origin: '*',
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthGateway {
  private readonly logger = new Logger(AuthGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id} /`);
  }

  async sendSocialAuthData(socketId: string, authData: any) {
    this.server.to(socketId).emit('socialAuthCallback', authData);
  }
}
