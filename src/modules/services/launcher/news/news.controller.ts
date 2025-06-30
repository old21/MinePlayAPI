import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { NewsService } from 'src/modules/news/news.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('launcher/news')
export class NewsController {
    constructor(private newsService: NewsService){}

    @Get('/')
    async getLast(@Res() res: Response) {
        const newData = await this.newsService.getLimit(3, ['id', 'uuid', 'slug', 'name', 'author', 'createdAt']);
        const placements = ["TOP", "LEFT", "RIGHT"];
        for(let i = 0; i < newData.length; i++){
            newData[i].placement = placements[i];
            newData[i].preview = this.newsService.getPreview(newData[i]);
            console.log(newData[i].author);
        }
        return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: newData });
    }
}