import { Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { ClientModule } from './client/client.module';
@Module({
  providers: [],
  controllers: [],
  imports: [ClientModule, ServerModule],
})
export class GameModule {}
