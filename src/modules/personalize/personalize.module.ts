import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from '../wallets/wallets.module';
import { Personalize } from './personalize.entity';
import { PersonalizeRarityModule } from './rarity/personalize.rarity.module';
import { PersonalizeService } from './personalize.service';
import { PersonalizeController } from './personalize.controller';
import { ShopModule } from '../shop/shop.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../users/auth/auth.module';
import { SessionsModule } from '../users/sessions/sessions.module';
@Module({
  providers: [PersonalizeService],
  controllers: [PersonalizeController],
  imports: [
    TypeOrmModule.forFeature([Personalize]),
    PersonalizeRarityModule,
    ShopModule,
    UsersModule,
    AuthModule,
    SessionsModule,
  ],
  exports: [PersonalizeService],
})
export class PersonalizeModule {}
