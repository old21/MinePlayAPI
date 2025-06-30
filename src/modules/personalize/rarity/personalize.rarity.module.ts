import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalizeRarity } from './personalize.rarity.entity';
import { PersonalizeRarityService } from './personalize.rarity.service';
import { PersonalizeRarityController } from './personalize.rarity.controller';

@Module({
  providers: [PersonalizeRarityService],
  controllers: [PersonalizeRarityController],
  imports: [
    TypeOrmModule.forFeature([ PersonalizeRarity ])
  ],
  exports: [PersonalizeRarityService]
})
export class PersonalizeRarityModule {}
