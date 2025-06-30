import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsController } from './news/news.controller';
import { NewsModule } from 'src/modules/news/news.module';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtLauncherKeypair } from 'src/helpers/keystore.helper';
import { UsersController } from './users/users.controller';
import { AuthController } from './users/auth/auth.controller';
import { AuthService } from './users/auth/auth.service';
import { UsersService } from './users/users.service';
import { SessionsModule } from 'src/modules/users/sessions/sessions.module';
import { BullModule } from '@nestjs/bull';
import { PrestarterController } from './prestarter/prestarter.controller';
import { PrestarterService } from './prestarter/prestarter.service';
import { StorageService } from 'src/services/storage.service';
@Module({
  providers: [AuthService, UsersService, PrestarterService, StorageService],
  controllers: [
    NewsController,
    UsersController,
    AuthController,
    PrestarterController,
  ],
  imports: [
    UsersModule,
    NewsModule,
    SessionsModule,
    JwtModule.register({
      privateKey: JwtLauncherKeypair.private,
      publicKey: JwtLauncherKeypair.public,
      signOptions: { expiresIn: '30d', algorithm: 'RS256' },
    }),
    BullModule.registerQueue({
      name: 'geoDetect',
    }),
  ],
  exports: [],
})
export class LauncherModule {}
