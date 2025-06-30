import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateShopItemDto } from '../../shop/dto/Create-shop-item.dto';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  readonly name: string;

  @IsArray()
  readonly shop: CreateShopItemDto[];
}
