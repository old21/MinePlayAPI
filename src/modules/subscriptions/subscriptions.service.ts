import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './subscriptions.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { ShopService } from '../shop/shop.service';
import { Sellable } from '../shop/shop.types';
import { UserItems } from '../shop/user.items.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Shop } from '../shop/shop.entity';
import { Bills } from '../wallets/wallets.types';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private shopService: ShopService,
  ) {}

  async getUserActiveSubscription(user: User): Promise<UserItems[]> {
    const subscriptions = await this.subscriptionsRepository.find();
    if (!subscriptions) {
      this.logger.error('В базу не добавлена ни одна подписка!');
      return;
    }

    return await this.shopService.getUserItems(user, Sellable.SUBSCRIPTION);

    // let expiresAt = Date().now;
    //
    // const userItems = await this.shopService.getUserItems(
    //   user,
    //   Sellable.SUBSCRIPTION,
    // );
    // for(const item of userItems) {
    //
    // }
  }

  async getSubscriptionsList(): Promise<Subscription[]> {
    return await this.subscriptionsRepository.find({
      relations: { shop: true },
    });
  }

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.save(
      this.subscriptionsRepository.create({ name: dto.name }),
    );
    const shopItems: Shop[] = [];
    for (const shop of dto.shop) {
      shopItems.push(
        await this.shopService.addShopItem(
          shop,
          Sellable.SUBSCRIPTION,
          subscription,
        ),
      );
    }
    subscription.shop = shopItems;
    return subscription;
  }
}
