import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { User } from '../users.entity';
import { OTP } from '../OTP/otp.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'varchar' })
  device: string;

  @Column({ type: 'varchar' })
  place: string;

  @Column({ type: 'varchar', nullable: true })
  browser: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  country: string;

  @Column({ type: 'boolean', default: false })
  expired: boolean;

  @Column({ type: 'boolean', default: false })
  online: boolean;

  isCurrent: boolean = false;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @OneToMany(() => OTP, (otp) => otp.createdBy)
  totp: OTP[];

  @Column({ type: 'bigint', readonly: true, default: 0 })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }

  @Column({ type: 'bigint', default: 0 })
  updatedAt: number;

  @BeforeInsert()
  updateDateUpdate() {
    this.updatedAt = Math.floor(Date.now() / 1000);
  }
}
