import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Transport } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class ViolationsService implements OnModuleInit {
  private readonly logger = new Logger(ViolationsService.name);
  private readonly kafkaClient: ClientKafka;

  constructor() {
    this.kafkaClient = new ClientKafka({
      client: {
        brokers: [`${process.env.KAFKA_IP}:${process.env.KAFKA_PORT}`],
        logLevel: 1,

      },
      consumer: {
        groupId: 'BackendConsumer',
      },
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Подключение к Kafka...');
      await this.kafkaClient.connect();
      this.logger.log('Успешно подключено к Kafka!');
      this.kafkaClient.emit('topic1', 0);
    } catch (error) {
      this.logger.error('Ошибка подключения к Kafka:', error);
    }
  }

  @EventPattern('BACKENDTEST')
  async handleEvent(message: any) {
    this.logger.log(message);
  }
}
