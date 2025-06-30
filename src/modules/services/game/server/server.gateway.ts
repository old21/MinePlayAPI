import { Server } from 'ws';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { PersonalizeService } from '../../../personalize/personalize.service';

@Injectable()
export class ServerGateway implements OnModuleInit {
  private socket: Server;
  private readonly logger = new Logger(ServerGateway.name);
  constructor(
    private usersService: UsersService,
    private personalizeService: PersonalizeService,
  ) {}

  onModuleInit() {
    this.socket = new Server({ port: Number(process.env.APP_MINECRAFT_PORT) });
    this.socket.on('connection', (ws) => {
      this.logger.debug('New client connected');
      ws.on('message', async (message) => {
        const request = JSON.parse(message);
        if (!request.type) {
          ws.send(this.error(null, 'No request type specified'));
          return;
        }
        try {
          switch (request.type) {
            case 'getPersonalizeRequest':
              const personalize = await this.personalizeService.getAll();
              ws.send(this.buildCallback('getPersonalize', personalize));
              break;
            case 'getUserInfoRequest':
              const user = await this.usersService.getById(
                request.body.userId,
                ['id'],
                { relations: { wallet: true } },
              );
              if (!user) {
                this.error('getUserInfo', 'User not found!');
                return;
              }

              //const personalize = this.personalizeService.getById(request.body.userId);

              const callback = this.buildCallback(request.type, {
                money: user.wallet.money,
                coins: user.wallet.realcoins,
                tokens: [
                  {
                    serverId: '803278d9-5296-46d4-9fdf-1faad92c4b10',
                    value: 0,
                  },
                ],
                personalize: [
                  {
                    id: 'cc7c2c9b-70cb-4283-aea7-f30fbd8a7373',
                    metadata: {},
                  },
                ],
              });
              ws.send(callback);
              break;
          }
        } catch (e) {
          console.log(e)
          ws.send(this.error(request.type, e.message));
        }
      });

      ws.on('close', () => {
        this.logger.debug('Client disconnected');
      });

      ws.on('error', (error) => {
        this.logger.error('WebSocket error:', error);
      });
    });
    this.logger.log(
      'WebSocket server is running on ws://localhost:' +
        process.env.APP_MINECRAFT_PORT,
    );
  }

  private buildCallback(name: string, data: any = null): string {
    return JSON.stringify({
      type: `${name}Response`,
      data,
    });
  }

  private error(name: string, message: string) {
    return JSON.stringify({
      type: `${name}Response`,
      message,
    });
  }
}
