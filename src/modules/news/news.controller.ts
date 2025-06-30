import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from '../users/auth/auth.guard';
import { CreateNewDto } from './dto/create-new.dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
    private usersService: UsersService,
  ) {}

  @Get('/')
  async getAll(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: await this.newsService.getPage(
        1,
        {
          id: true,
          uuid: true,
          slug: true,
          name: true,
          shortStory: true,
          views: true,
          likes: true,
          time: true,
          createdAt: true,
          updatedAt: true,
          author: { id: true, name: true, skin: true, avatar: true },
          category: { id: true, slug: true, name: true },
        },
        { relations: { author: true, category: true } },
      ),
    });
  }

  @Get('/id/:id')
  async getById(@Res() res: Response, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: await this.newsService.getById(id, {
        select: {
          id: true,
          uuid: true,
          slug: true,
          name: true,
          shortStory: true,
          fullStory: true,
          views: true,
          likes: true,
          time: true,
          createdAt: true,
          updatedAt: true,
          author: { id: true, name: true, skin: true, avatar: true },
          category: { id: true, slug: true, name: true },
        },
        relations: { author: true, category: true },
      }),
    });
  }

  @UseGuards(AuthGuard)
  @FormDataRequest()
  @Post('create')
  async getProfile(@Req() request, @Body() dto: CreateNewDto) {
    const user = await this.usersService.getById(request.user.id);
    const newItem = await this.newsService.create(dto, user);

    return newItem;
  }

  @UseGuards(AuthGuard)
  @Get('/like/:id')
  async like(@Req() request, @Param('id') id: number, @Res() res: Response) {
    const user = await this.usersService.getById(request.user.id, ['id'], {
      relations: { likes: true },
    });
    const newItem = await this.newsService.getById(id, {
      relations: { userLikes: true },
    });
    const action = await this.newsService.like(user, newItem);
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: action });
  }
}
