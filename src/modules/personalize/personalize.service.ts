import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { textToSlug } from 'src/helpers/language.helper';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { Personalize } from './personalize.entity';
import { CreatePersonalizeDto } from './dto/create-personalize.dto';
import { PersonalizeRarityService } from './rarity/personalize.rarity.service';
import { ShopService } from '../shop/shop.service';
import { UsersService } from '../users/users.service';
import { Sellable } from '../shop/shop.types';

@Injectable()
export class PersonalizeService {
  constructor(
    @InjectRepository(Personalize)
    private personalizeRepository: Repository<Personalize>,
    private rarityService: PersonalizeRarityService,
    private shopService: ShopService,
    private usersService: UsersService,
  ) {}

  async getAll(): Promise<Personalize[]> {
    return await this.personalizeRepository.find({
      relations: { shop: true, rarity: true },
    });
  }

  async getById(id: number): Promise<Personalize> {
    return await this.personalizeRepository.findOne({
      where: { id },
      relations: { shop: true, rarity: true },
    });
  }

  async getByUUID(uuid: string): Promise<Personalize> {
    return await this.personalizeRepository.findOne({
      where: { uuid },
      relations: { shop: true, rarity: true },
    });
  }

  // async getByName(name: string): Promise<Rarity> {
  //     return await this.rarityRepository.findOne({ where: { name } });
  // }

  async create(dto: CreatePersonalizeDto): Promise<Personalize> {
    const slug = textToSlug(dto.name);
    const promiseList = [];

    const rarity = await this.rarityService.getById(dto.rarity as string);
    if (!rarity) {
      throw new BadRequestException(
        4101,
        'Редкость с данным ID не существует!',
      );
    }
    delete dto.rarity;

    for (let i = 0; i < dto.shop.length; i++) {
      promiseList.push(
        this.shopService.addShopItem(dto.shop[i], Sellable.PERSONALIZATION),
      );
    }
    const shop = await Promise.all(promiseList);

    const item = this.personalizeRepository.create({
      ...dto,
      slug,
      shop,
      rarity,
    });

    return await this.personalizeRepository.save(item);
  }
}
