import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { Wallet } from '../wallets.entity';
import { Actions } from './transactions.types';
import { Bills, ExchangeBills, ReplenishTypes } from '../wallets.types';
import { Shop } from '../../shop/shop.entity';
import { RedeemCode } from '../../redeem/redeem.entity';

@Entity('wallets_transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  action: Actions;

  @Column({ type: 'integer', default: null })
  exchangeTo: ExchangeBills;

  @Column({ type: 'integer' })
  bill: Bills;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'integer', nullable: true })
  replenishType: ReplenishTypes;

  @Column({ type: 'bigint', readonly: true, default: 0 })
  createdAt: number;

  @ManyToOne(() => Shop, (item) => item.transactions)
  @JoinColumn()
  shopItem: Shop;

  @ManyToOne(() => Wallet)
  @JoinColumn()
  sender: Wallet;

  @ManyToOne(() => Wallet)
  @JoinColumn()
  receiver: Wallet;

  @ManyToOne(() => RedeemCode)
  @JoinColumn()
  redeem: RedeemCode;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.round(new Date().getTime() / 1000);
  }

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn()
  wallet: Wallet;
}
