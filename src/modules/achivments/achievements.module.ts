import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './achievements.entity';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [TypeOrmModule.forFeature([Achievement])],
})
export class AchievementsModule {}
