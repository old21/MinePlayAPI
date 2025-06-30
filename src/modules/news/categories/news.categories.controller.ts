import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { NewsCategoriesService } from './news.categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('news/categories')
export class NewsCategoriesController {
  constructor(private newsCategoriesService: NewsCategoriesService) {}

  @Get('/')
  async getAll(@Res() res: Response) {
    const categories = await this.newsCategoriesService.getAll();
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: categories,
    });
  }

  @Post('/create')
  async create(@Res() res: Response, @Body() dto: CreateCategoryDto) {
    const category = await this.newsCategoriesService.create(
      dto.name,
      dto.description,
    );
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: category,
    });
  }
}
