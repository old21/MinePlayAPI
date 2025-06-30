import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Shop } from './shop.entity';
import { CreateShopItemDto } from './dto/Create-shop-item.dto';
import { WalletsService } from '../wallets/wallets.service';
import { Bills } from '../wallets/wallets.types';
import { ItemLimitExceeded, VaultNotAvailable } from './shop.exceptions';
import { UserItems } from './user.items.entity';
import { DateHelper } from '../../helpers/date.helper';
import { Sellable, ServiceKeys } from './shop.types';
import { Personalize } from '../personalize/personalize.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private shopRepository: Repository<Shop>,
    @InjectRepository(UserItems)
    private userItemsRepository: Repository<UserItems>,
    private walletsService: WalletsService,
  ) {}

  async getById(id: string): Promise<Shop> {
    return await this.shopRepository.findOne({ where: { id } });
  }

  async getShopService(serviceKey: ServiceKeys): Promise<Shop> {
    return await this.shopRepository.findOne({
      where: { serviceKey, itemType: Sellable.SERVICE },
    });
  }
  async addShopService(serviceKey: ServiceKeys, money: number): Promise<Shop> {
    const shopItem = this.shopRepository.create({
      serviceKey,
      itemType: Sellable.SERVICE,
      money,
    });
    return await this.shopRepository.save(shopItem);
  }
  async getUserItems(user: User, itemType: Sellable | null = null) {
    return this.userItemsRepository.find({
      relations: ['shopItem'],
      where: {
        shopItem: {
          itemType,
        },
      },
    });
  }
  async addShopItem(
    dto: CreateShopItemDto,
    type: Sellable,
    item: Personalize | Subscription = null,
  ): Promise<Shop> {
    const shopItem = this.shopRepository.create({
      money: dto.money,
      coins: dto.coins,
      keys: dto.keys,
      itemType: type,
      period: dto.period,
      periodName: dto.periodName,
    });

    switch (type) {
      case Sellable.PERSONALIZATION:
        shopItem.personalize = item as Personalize;
        break;
      case Sellable.SUBSCRIPTION:
        shopItem.subscription = item as Subscription;
        break;
    }

    const shop = await this.shopRepository.save(shopItem);
    switch (type) {
      case Sellable.PERSONALIZATION:
        delete shop.personalize;
        break;
      case Sellable.SUBSCRIPTION:
        delete shop.subscription;
        break;
    }
    return shop;
  }

  async purchaseItem(item: Shop, user: User, bill: Bills) {
    switch (bill) {
      case Bills.MONEY:
        if (item.money === null) {
          throw new VaultNotAvailable();
        }
        break;
      case Bills.COINS:
        if (item.coins === null) {
          throw new VaultNotAvailable();
        }
        break;
      case Bills.KEYS:
        if (item.keys === null) {
          throw new VaultNotAvailable();
        }
        break;
    }
    if (item.limit !== null && item.limit === 0) {
      throw new ItemLimitExceeded();
    }
    const transaction = await this.walletsService.purchase(user, bill, item);

    if (item.limit !== null) {
      await this.itemLimitUpdate(item, item.limit - 1);
    }
    if (item.itemType !== Sellable.SERVICE) {
      if (item.period !== null) {
        const userItem = this.userItemsRepository.create({
          user,
          shopItem: item,
          expiresAt: DateHelper.getExpirationTimestamp(item.period),
        });
        await this.userItemsRepository.save(userItem);
      } else {
        const userItem = this.userItemsRepository.create({
          user,
          shopItem: item,
        });
        await this.userItemsRepository.save(userItem);
      }
    }
    transaction.wallet = this.walletsService.unionCoins(transaction.wallet);
    return transaction;
  }

  async itemLimitUpdate(item: Shop, limit: number): Promise<Shop> {
    item.limit = limit;
    return await this.shopRepository.save(item);
  }
}
