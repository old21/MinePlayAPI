import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Token } from 'src/decorators/token.decorator';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { TokenGuard } from 'src/guards/token.guard';
import { UsersService } from 'src/modules/users/users.service';

@Controller('launcher/users')
@UseGuards(TokenGuard)
@Token(process.env.LAUNCHER_TOKEN)
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get('name/:name')
    async getUserByUsername(@Param('name') name: string, @Res() res: Response) {
        const user = await this.usersService.getByLogin(name);
        res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: user });
    }
    
    @Get('uuid/:uuid')
    async getUserByUUID(@Param('uuid') uuid: string, @Res() res: Response, @Req() request) {

    }
}