import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RedeemTypes } from './redeem.types';
import { User } from '../users/users.entity';

@Entity('redeem')
export class RedeemCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'boolean' })
  isPlayer: boolean;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'integer' })
  type: RedeemTypes;

  @Column({ type: 'integer' })
  value: number;

  @Column({ type: 'bigint', default: 0, select: false })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.redeemOwned)
  @JoinColumn()
  owner: User;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}
