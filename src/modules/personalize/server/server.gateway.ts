import { Injectable, OnModuleInit } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class TcpService implements OnModuleInit {
  private server: net.Server;
  private clients: net.Socket[] = [];

  onModuleInit() {
    this.server = net.createServer(socket => {
      this.clients.push(socket);
      console.log('Client connected');

      socket.on('data', data => {
        console.log('Received: ' + data);
        // Обработка входящих данных
      });

      socket.on('end', () => {
        console.log('Client disconnected');
        this.clients = this.clients.filter(client => client !== socket);
      });
    });

    this.server.listen(Number(process.env.APP_NETTY_PORT), '127.0.0.1', () => {
      console.log('TCP Server listening on port 3000');
    });
  }

  sendMessage(message: string) {
    this.clients.forEach(client => {
      client.write(message);
    });
  }
}