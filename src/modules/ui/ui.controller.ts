import { TopService } from './top/top.service';
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { SlidersService } from './sliders/sliders.service';
import { CreateSliderDto } from './sliders/dto/create-slider.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateTopDto } from './top/dto/create-top.dto';

@Controller('ui')
export class UiController {
  constructor(
    private slidersService: SlidersService,
    private topService: TopService,
  ) {}

  @Get('slider')
  getAllSliders() {
    return {
      status: HttpStatus.OK,
      data: this.slidersService.findAll(),
    };
  }
  @Post('slider')
  @FormDataRequest()
  async addSlider(@Body() dto: CreateSliderDto) {
    const slider = await this.slidersService.add(dto);
    return {
      status: HttpStatus.OK,
      data: slider,
    };
  }

  @Get('top')
  getActiveTop() {
    return {
      status: HttpStatus.OK,
      data: this.topService.findActive(),
    };
  }
  @Post('top')
  @FormDataRequest()
  async addTop(@Body() dto: CreateTopDto) {
    const top = await this.topService.add(dto);
    return {
      status: HttpStatus.OK,
      data: top,
    };
  }
}
