import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Minigames } from './minigames.entity';
import { MinigamesWallets } from './wallets/minigames-wallets.entity';

@Module({
  providers: [],
  controllers: [],
  imports: [TypeOrmModule.forFeature([Minigames, MinigamesWallets])],
})
export class MinigamesModule {}
