import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Shop } from './shop.entity';

@Entity('users_items')
export class UserItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Shop, (shopItem) => shopItem.owners)
  @JoinColumn()
  shopItem: Shop;

  @Column({ type: 'bigint', default: 0 })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }

  @Column({ type: 'bigint', nullable: true })
  expiresAt: number;
}
