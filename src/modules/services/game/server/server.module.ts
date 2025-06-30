import { Module } from '@nestjs/common';
import { UsersModule } from '../../../users/users.module';
import { PersonalizeModule } from '../../../personalize/personalize.module';
import { ViolationsModule } from './violations/violations.module';

@Module({
  providers: [],
  controllers: [],
  imports: [UsersModule, PersonalizeModule, ViolationsModule],
})
export class ServerModule {}
