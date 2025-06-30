import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PersonalizeRarityService } from './personalize.rarity.service';
import { CreatePersonalizeRarityDto } from './dto/create-rarity.dto';

@Controller('personalize/rarity')
export class PersonalizeRarityController {
    constructor(private rarityService: PersonalizeRarityService){}

    @Post('/create')
    async create(@Body() dto: CreatePersonalizeRarityDto, @Res() res: Response) {
        const rarity = await this.rarityService.create(dto);
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: rarity });
    }

    @Get('/')
    async getAll(@Res() res: Response) {
        const rarity = await this.rarityService.getAll();
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: rarity });
    }

    @Get('/id/:id')
    async getById(@Param('id') id: string, @Res() res: Response) {
        const rarity = await this.rarityService.getById(id);
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: rarity });
    }
}