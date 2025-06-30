import { Module, forwardRef } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { ShopModule } from '../shop/shop.module';
import { SessionsModule } from '../users/sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { StorageService } from '../../services/storage.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService, StorageService],
  exports: [RolesService],
  imports: [
    TypeOrmModule.forFeature([Role]),
    ShopModule,
    SessionsModule,
    NestjsFormDataModule,
    forwardRef(() => UsersModule),
  ],
})
export class RolesModule {}
