import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Sellable, ServiceKeys } from './shop.types';
import { Personalize } from '../personalize/personalize.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { UserItems } from './user.items.entity';
import { Transaction } from '../wallets/transactions/transactions.entity';

@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  money: number;

  @Column({ type: 'integer', default: null })
  coins: number;

  @Column({ type: 'integer', default: null })
  keys: number;

  /* 
        Временные предметы(донат, подписки) 
        null - безлимит
    */
  @Column({ type: 'bigint', default: null })
  period: number;

  @Column({ type: 'varchar', default: null })
  periodName: number;

  @Column({ type: 'integer', default: null })
  limit: number;

  @Column({ type: 'varchar' })
  itemType: Sellable;

  @Column({ type: 'integer', default: null })
  serviceKey: ServiceKeys;

  @ManyToOne(() => Personalize, (personalize) => personalize.shop)
  @JoinColumn()
  personalize: Personalize;

  @ManyToOne(() => Subscription, (subscription) => subscription.shop)
  @JoinColumn()
  subscription: Subscription;

  @OneToMany(() => Transaction, (transaction) => transaction.shopItem)
  transactions: Transaction[];

  @OneToMany(() => UserItems, (item) => item.shopItem)
  owners: UserItems[];

  @Column({ type: 'bigint', readonly: true, default: 0, select: false })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}
