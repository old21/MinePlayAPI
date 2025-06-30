import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Wallet } from '../../wallets/wallets.entity';
import { Minigames } from "../minigames.entity";

@Entity('minigames_wallets')
export class MinigamesWallets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.games)
  @JoinColumn()
  wallet: Wallet;

  @ManyToOne(() => Minigames, (game) => game.wallets)
  @JoinColumn()
  game: Minigames;

  @Column({ type: 'integer', default: 0 })
  value: number;

  @Column({ type: 'bigint', default: 0 })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.round(new Date().getTime() / 1000);
  }
}
