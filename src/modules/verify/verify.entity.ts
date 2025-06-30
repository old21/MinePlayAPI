import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from '../users/users.entity';
import { EmailTypes } from './verify.types';

@Entity('confirmations')
export class Confirmation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  code: number;

  @Column({ type: 'integer' })
  type: EmailTypes;

  @ManyToOne(() => User, (user) => user.confirmations)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'bigint', default: 0 })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.round(new Date().getTime() / 1000);
  }
}
