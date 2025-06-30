import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { RolesModule } from '../roles/roles.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TexturesService } from './textures/textures.service';
import { StorageService } from 'src/services/storage.service';
import { TexturesController } from './textures/textures.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UsersSecurityController } from './users.security.controller';
import { Textures } from './textures/textures.entity';
import { OTPModule } from './OTP/otp.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { EmailModule } from './OTP/providers/email/email.module';
import { ShopModule } from '../shop/shop.module';
import { VerifyModule } from '../verify/verify.module';
import { UsersGateway } from './users.gateway';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  controllers: [UsersController, TexturesController, UsersSecurityController],
  providers: [UsersService, TexturesService, StorageService, UsersGateway],
  exports: [UsersService, TexturesService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Textures]),
    WalletsModule,
    NestjsFormDataModule,
    SessionsModule,
    EmailModule,
    OTPModule,
    VerifyModule,
    forwardRef(() => SubscriptionsModule),
    forwardRef(() => RolesModule),
    forwardRef(() => ShopModule),
  ],
})
export class UsersModule {}
