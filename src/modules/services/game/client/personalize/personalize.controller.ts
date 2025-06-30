import { Controller, Get, HttpStatus } from '@nestjs/common';
import { PersonalizeService } from '../../../../personalize/personalize.service';

@Controller('client/personalize')
export class PersonalizeController {
  constructor(private personalizeService: PersonalizeService) {}

  @Get('/')
  async getAllPersonalize() {
    return {
      status: HttpStatus.OK,
      data: await this.personalizeService.getAll(),
    };
  }
}
