import { IsNumber, IsUUID } from 'class-validator';
import { Bills } from '../../wallets/wallets.types';

export class PurchaseItemDto {
  @IsUUID()
  readonly itemId: string;

  @IsNumber()
  readonly bill: Bills;
}
