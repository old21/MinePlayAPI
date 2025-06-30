import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { MinigamesWallets } from './wallets/minigames-wallets.entity';

@Entity('minigames')
export class Minigames {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  serviceName: string;

  @Column({ type: 'bigint', default: 0 })
  createdAt: number;

  @OneToMany(() => MinigamesWallets, (wallet) => wallet.game)
  wallets: MinigamesWallets[];

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.round(new Date().getTime() / 1000);
  }
}
