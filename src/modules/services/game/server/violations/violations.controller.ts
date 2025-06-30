import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ViolationsController {
  private readonly logger = new Logger(ViolationsController.name);
  @EventPattern('BACKENDTEST')
  async handleSecondTopic(@Payload() message: any) {
    this.logger.error(
      'Second Consumer получил сообщение:',
      message.value.toString(),
    );
  }
}
