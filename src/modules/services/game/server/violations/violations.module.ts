import { Module } from '@nestjs/common';
import { ViolationsController } from './violations.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [ViolationsController],
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [`${process.env.KAFKA_IP}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'BackendConsumer',
          },
        },
      },
    ]),
  ],
  exports: [],
})
export class ViolationsModule {}
