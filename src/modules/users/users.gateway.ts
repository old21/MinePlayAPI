import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from 'socket.io';
import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Socket } from '../../interfaces/socket.interface';
import { WebsocketExceptionsFilter } from '../../filters/error.filter';
import { WSAuthGuard } from './auth/auth.ws.guard';
import { UsersService } from './users.service';
import { GetUserDto } from './dto/get-user.dto';

@WebSocketGateway(8080, {
  namespace: '/',
  cors: {
    origin: '*',
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersGateway {
  private readonly logger = new Logger(UsersGateway.name);
  constructor(private usersService: UsersService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id} /`);
  }

  @SubscribeMessage('getUserLikeName')
  @UseGuards(WSAuthGuard)
  async handleNewsLike(
    @MessageBody() dto: GetUserDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    let users = await this.usersService.findLikeName(dto.name, [
      'id',
      'name',
      'skin',
      'avatar',
      'banner',
      'params',
    ]);
    for (const i in users) {
      const assets = await this.usersService.getAssets(users[i]);
      users[i].avatar = assets.avatar;
      users[i].skin = assets.skin;
      users[i].banner = assets.banner;
      users[i].cloak = assets.cloak;
    }
    users = users.filter((user) => {
      return user.id !== client.user.id;
    });
    this.server.emit('getUserLikeNameCallback', users);
  }
}
