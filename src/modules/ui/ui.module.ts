import { Module } from '@nestjs/common';

import { SlidersService } from './sliders/sliders.service';
import { TopService } from './top/top.service';

import { UiController } from './ui.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Slider } from './sliders/sliders.entity';
import { TopBlock } from './top/top.entity';

import { NestjsFormDataModule } from 'nestjs-form-data';
import { StorageService } from 'src/services/storage.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ Slider, TopBlock ]),
    NestjsFormDataModule,
  ],
  providers: [SlidersService,TopService, StorageService],
  controllers: [UiController],
  exports: [SlidersService, TopService],
})
export class UiModule {}