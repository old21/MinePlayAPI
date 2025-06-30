import { Transaction } from './transactions.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UsersModule } from '../../users/users.module';
import { SessionsModule } from '../../users/sessions/sessions.module';
import { WalletsModule } from '../wallets.module';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => UsersModule),
    forwardRef(() => SessionsModule),
    forwardRef(() => WalletsModule),
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
