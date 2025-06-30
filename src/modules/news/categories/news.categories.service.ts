import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsCategory } from './news.categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { textToSlug } from "../../../helpers/language.helper";

@Injectable()
export class NewsCategoriesService {
  constructor(
    @InjectRepository(NewsCategory)
    private newsCatRepository: Repository<NewsCategory>,
  ) {}

  async getById(id: string): Promise<NewsCategory> {
    return await this.newsCatRepository.findOne({ where: { id: id } });
  }

  async getAll(): Promise<NewsCategory[]> {
    return await this.newsCatRepository.find();
  }

  async create(name: string, description: string): Promise<NewsCategory> {
    const slug = textToSlug(name);
    const category = this.newsCatRepository.create({ name, description, slug });
    return await this.newsCatRepository.save(category);
  }
}
