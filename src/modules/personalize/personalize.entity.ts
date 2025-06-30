import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { PersonalizeTypes } from './personalize.types';
import { Shop } from '../shop/shop.entity';
import { PersonalizeRarity } from './rarity/personalize.rarity.entity';
import { User } from '../users/users.entity';

@Entity('personalization')
export class Personalize {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'integer' })
  placement: PersonalizeTypes;

  @OneToMany(() => Shop, (shopItem) => shopItem.personalize)
  @JoinColumn()
  shop: Shop[];

  @ManyToOne(() => PersonalizeRarity, (rarity) => rarity.items)
  @JoinColumn()
  rarity: PersonalizeRarity;
}
