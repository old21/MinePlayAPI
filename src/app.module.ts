import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/users/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './modules/roles/roles.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { UiModule } from './modules/ui/ui.module';
import * as redisStore from 'cache-manager-redis-store';

//Mailer
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

//Queue Module
import { BullModule } from '@nestjs/bull';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { VerifyModule } from './modules/verify/verify.module';
import { EmailProcessor } from './processors/Email.processor';
import { GeoDetectProcessor } from './processors/GeoDetect.processor';
import { ServersModule } from './modules/servers/servers.module';
import { NewsModule } from './modules/news/news.module';
import { AppController } from './app.controller';
import { ReferalsModule } from './modules/referals/referals.module';
import { TransactionsModule } from './modules/wallets/transactions/transactions.module';
import { OrdersModule } from './modules/wallets/orders/orders.module';
import { LauncherModule } from './modules/services/launcher/launcher.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { OTPModule } from './modules/users/OTP/otp.module';
import { SessionsModule } from './modules/users/sessions/sessions.module';
import { ShopModule } from './modules/shop/shop.module';
import { PersonalizeModule } from './modules/personalize/personalize.module';
import { TypeORMConfig } from './config/typeorm.config';
import { GameModule } from './modules/services/game/game.module';
import { MinigamesModule } from './modules/minigames/minigames.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { BonusModule } from './modules/bonus/bonus.module';
import { RedeemModule } from './modules/redeem/redeem.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    }),
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(TypeORMConfig),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        ignoreTLS: process.env.MAIL_IGNORE_TLS,
        secure: process.env.MAIL_SECURE,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      },
      template: {
        dir: './src/resources/mail',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.forRoot({
      prefix: 'queue',
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_DEFAULT_TTL),
        limit: Number(process.env.THROTTLE_DEFAULT_LIMIT),
      },
    ]),
    AuthModule,
    UsersModule,
    SessionsModule,
    RolesModule,
    WalletsModule,
    TransactionsModule,
    UiModule,
    VerifyModule,
    ServersModule,
    NewsModule,
    ReferalsModule,
    OrdersModule,
    LauncherModule,
    IncidentsModule,
    ShopModule,
    OTPModule,
    PersonalizeModule,
    GameModule,
    MinigamesModule,
    SubscriptionsModule,
    BonusModule,
    RedeemModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    EmailProcessor,
    GeoDetectProcessor,
  ],
})
export class AppModule {}
