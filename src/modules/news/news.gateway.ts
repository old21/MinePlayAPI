import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LikeNewDto } from './dto/like-new.dto';
import { NewsService } from './news.service';
import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WSAuthGuard } from '../users/auth/auth.ws.guard';
import { Socket } from '../../interfaces/socket.interface';
import { UsersService } from '../users/users.service';
import { WSBadRequestException } from '../../exceptions/BadRequestException';
import { WebsocketExceptionsFilter } from '../../filters/error.filter';

@WebSocketGateway(Number(process.env.APP_SOCKET_PORT), {
  namespace: '/',
  cors: {
    origin: '*',
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class NewsGateway {
  private readonly logger = new Logger(NewsGateway.name);

  constructor(
    private newsService: NewsService,
    private usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id} /`);
    //UserID: ${client.user.id} / Session ${client.user.session.id}
  }

  @SubscribeMessage('likeNew')
  @UseGuards(WSAuthGuard)
  async handleNewsLike(
    @MessageBody() data: LikeNewDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = await this.usersService.getById(
      client.user.id,
      ['id', 'avatar', 'skin'],
      {
        relations: { likes: true },
      },
    );
    const newItem = await this.newsService.getById(data.newId, {
      relations: { userLikes: true, author: true },
    });
    if (!newItem) {
      throw new WSBadRequestException('likeNew', 4101, 'New not found!');
    }

    const like = await this.newsService.like(user, newItem);
    this.server.emit('likeNewCallback', like);
  }
}
