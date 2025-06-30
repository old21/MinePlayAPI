import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './incidents.entity';
import { IncidentsService } from './incidents.service';
@Module({
  providers: [IncidentsService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ Incident ]),
  ],
  exports: [IncidentsService]
})
export class IncidentsModule {}
