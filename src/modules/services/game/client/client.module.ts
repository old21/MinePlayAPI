import { Module } from '@nestjs/common';
import { PersonalizeController } from './personalize/personalize.controller';
import { PersonalizeModule } from '../../../personalize/personalize.module';
@Module({
  providers: [],
  controllers: [PersonalizeController],
  imports: [PersonalizeModule],
})
export class ClientModule {}
