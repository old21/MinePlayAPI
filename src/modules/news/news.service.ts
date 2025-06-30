import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { News } from './news.entity';
import { CreateNewDto } from './dto/create-new.dto';
import { textToSlug } from 'src/helpers/language.helper';
import { NewsCategoriesService } from './categories/news.categories.service';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { StorageService } from 'src/services/storage.service';
import { UsersService } from '../users/users.service';
import { TexturesService } from '../users/textures/textures.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepository: Repository<News>,
    private usersService: UsersService,
    private texturesService: TexturesService,
    private newsCatService: NewsCategoriesService,
    private storageService: StorageService,
  ) {}
  PAGELIMIT = 7;

  async create(dto: CreateNewDto, user: User): Promise<News> {
    const nameUnique = this.newsRepository.findOne({
      where: { name: dto.name },
    });
    const category = this.newsCatService.getById(dto.category);
    const validator = await Promise.all([nameUnique, category]);

    if (validator[0]) {
      throw new BadRequestException(4101, 'Current name already exists');
    }
    if (!validator[1]) {
      throw new BadRequestException(4102, "Category doesn't exist");
    }
    const news = await this.newsRepository.create({
      name: dto.name,
      shortStory: dto.shortStory,
      fullStory: dto.fullStory,
      time: Number(dto.time),
      author: user,
      slug: textToSlug(dto.name),
      category: validator[1],
    });
    const newSave = await this.newsRepository.save(news);
    const previewPath = await this.storageService.upload(
      dto.preview,
      '/news/',
      `${news.id}.png`,
    );
    newSave.preview = previewPath;
    return await this.newsRepository.save(newSave);
  }

  async getLimit(
    limit: number = null,
    select = null,
    options = null,
  ): Promise<News[]> {
    if (select === null)
      select = {
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
        author: { id: true, name: true },
        category: { id: true, slug: true, name: true },
        fullStory: true,
      };

    const news = await this.newsRepository.find({
      select: select,
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      ...options,
    });

    for (let i = 0; i < news.length; i++) {
      news[i].preview = this.getPreview(news[i]);
    }

    return news;
  }

  async getPage(page: number, select = null, options = null): Promise<News[]> {
    if (select === null)
      select = {
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
        fullStory: true,
      };

    const news = await this.newsRepository.find({
      select: select,
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * this.PAGELIMIT,
      take: this.PAGELIMIT,
      ...options,
    });
    for (let i = 0; i < news.length; i++) {
      news[i].preview = this.getPreview(news[i]);
      news[i].author.avatar = await this.texturesService.getUserAvatar(
        news[i].author,
      );
      delete news[i].author.skin;
    }

    return news;
  }

  async getById(id: number, params = null) {
    const newItem = await this.newsRepository.findOne({
      where: { id },
      ...params,
    });
    this.addView(newItem);
    newItem.preview = this.getPreview(newItem);
    newItem.author.avatar = await this.texturesService.getUserAvatar(
      newItem.author,
    );
    delete newItem.author.skin;

    return newItem;
  }
  async getByUUID(uuid: string, params = null) {
    const newItem = await this.newsRepository.findOne({
      where: { uuid },
      ...params,
    });
    this.addView(newItem);
    newItem.preview = this.getPreview(newItem);
    newItem.author.avatar = await this.texturesService.getUserAvatar(
      newItem.author,
    );
    delete newItem.author.skin;

    return newItem;
  }

  async like(user: User, newItem: News) {
    if (this.checkUserLike(user, newItem)) {
      const promise = await Promise.all([
        this.usersService.removeLike(user, newItem),
        this.removeLikes(newItem, 1),
      ]);
      return { type: 'unset', likes: promise[1] };
    }

    const promise = await Promise.all([
      this.usersService.addLike(user, newItem),
      this.addLikes(newItem, 1),
    ]);
    return { type: 'set', likes: promise[1] };
  }

  getPreview(newItem: News) {
    return this.storageService.get(`/news/${newItem.id}.png`);
  }

  async addView(newItem: News) {
    newItem.views += 1;

    return await this.newsRepository.save(newItem);
  }

  async addLikes(newItem: News, amount: number) {
    newItem.likes += amount;

    this.newsRepository.save(newItem);

    return newItem.likes;
  }

  async removeLikes(newItem: News, amount: number) {
    newItem.likes -= amount;

    this.newsRepository.save(newItem);

    return newItem.likes;
  }

  checkUserLike(user: User, newItem: News) {
    for (let i = 0; i < user.likes.length; i++) {
      if (user.likes[i].id == newItem.id) {
        return true;
      }
    }

    return false;
  }
}
