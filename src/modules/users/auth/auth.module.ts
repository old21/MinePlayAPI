import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthConfirmController } from './auth-confirmation.controller';
import { JwtAPIKeypair } from '../../../helpers/keystore.helper';
import { ConfigModule } from '@nestjs/config';
import { VerifyModule } from '../../verify/verify.module';
import { WalletsModule } from '../../wallets/wallets.module';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProvider } from './auth.provider.entity';
import { GoogleProvider } from 'src/services/authProviders/google.provider';
import { ReferalsModule } from 'src/modules/referals/referals.module';
import { DiscordProvider } from 'src/services/authProviders/discord.provider';
import { SessionsModule } from '../sessions/sessions.module';
import { AuthGuard } from './auth.guard';
import { OTPModule } from '../OTP/otp.module';
import { AuthRestoreController } from './restore/auth-restore.controller';
import { AuthRestoreService } from './restore/auth-restore.service';
import { AuthGateway } from './auth.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),
    VerifyModule,
    forwardRef(() => WalletsModule),
    forwardRef(() => ReferalsModule),
    forwardRef(() => OTPModule),
    forwardRef(() => SessionsModule),
    TypeOrmModule.forFeature([AuthProvider]),
    JwtModule.register({
      global: true,
      privateKey: JwtAPIKeypair.private,
      publicKey: JwtAPIKeypair.public,
      signOptions: { expiresIn: '60m', algorithm: 'RS256' },
    }),
    BullModule.registerQueue({
      name: 'geoDetect',
    }),
    BullModule.registerQueue({
      name: 'emailSendings',
    }),
  ],
  providers: [
    AuthService,
    GoogleProvider,
    DiscordProvider,
    AuthGuard,
    AuthRestoreService,
    AuthGateway,
  ],
  controllers: [AuthController, AuthConfirmController, AuthRestoreController],
  exports: [AuthService],
})
export class AuthModule {}
