import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Shop } from '../shop/shop.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Shop, (shopItem) => shopItem.subscription)
  @JoinColumn()
  shop: Shop[];

  @Column({ type: 'bigint', default: 0 })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.round(new Date().getTime() / 1000);
  }
}
