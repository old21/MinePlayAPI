import { Module, forwardRef } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { RobokassaService } from 'src/services/payments/robokassa.service';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ReferalsModule } from '../referals/referals.module';
import { SessionsModule } from '../users/sessions/sessions.module';
import { AuthModule } from '../users/auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { OTPModule } from '../users/OTP/otp.module';
import { EmailModule } from '../users/OTP/providers/email/email.module';

@Module({
  providers: [WalletsService, RobokassaService],
  controllers: [WalletController],
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    OrdersModule,
    AuthModule,
    OTPModule,
    forwardRef(() => SessionsModule),
    forwardRef(() => ReferalsModule),
    forwardRef(() => RolesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
    EmailModule,
  ],
  exports: [WalletsService],
})
export class WalletsModule {}
