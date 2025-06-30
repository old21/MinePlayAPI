import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity';
import { NewsCategory } from './categories/news.categories.entity';
import { NewsComment } from './comments/news.comments.entity';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { UsersModule } from '../users/users.module';
import { NewsCategoriesService } from './categories/news.categories.service';
import { StorageService } from 'src/services/storage.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from '../users/auth/auth.module';
import { SessionsModule } from '../users/sessions/sessions.module';
import { NewsCategoriesController } from './categories/news.categories.controller';
import { NewsGateway } from './news.gateway';
import { OTPModule } from '../users/OTP/otp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([News, NewsCategory, NewsComment]),
    OTPModule,
    UsersModule,
    AuthModule,
    NestjsFormDataModule,
    SessionsModule,
  ],
  providers: [NewsService, NewsCategoriesService, StorageService, NewsGateway],
  controllers: [NewsController, NewsCategoriesController],
  exports: [NewsService],
})
export class NewsModule {}
