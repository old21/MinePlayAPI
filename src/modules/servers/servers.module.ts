import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './servers.entity';
import { ServersController } from './servers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Server ]),
  ],
  providers: [ServersService],
  controllers: [ServersController],
  exports: [ServersService],
})
export class ServersModule {}