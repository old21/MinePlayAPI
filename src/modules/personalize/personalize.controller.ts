import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PersonalizeService } from './personalize.service';
import { CreatePersonalizeDto } from './dto/create-personalize.dto';
import { UsersService } from '../users/users.service';

@Controller('personalize')
export class PersonalizeController {
  constructor(
    private personalizeService: PersonalizeService,
    private usersService: UsersService,
  ) {}

  @Post('/create')
  async create(@Body() dto: CreatePersonalizeDto, @Res() res: Response) {
    const rarity = await this.personalizeService.create(dto);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: rarity });
  }

  @Get('/')
  async getAll(@Res() res: Response) {
    const rarity = await this.personalizeService.getAll();
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: rarity });
  }

  @Get('/id/:id')
  async getById(@Param('id') id: number, @Res() res: Response) {
    const rarity = await this.personalizeService.getById(id);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: rarity });
  }

  @Get('/uuid/:uuid')
  async getByUUID(@Param('uuid') uuid: string, @Res() res: Response) {
    const rarity = await this.personalizeService.getByUUID(uuid);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: rarity });
  }
}
