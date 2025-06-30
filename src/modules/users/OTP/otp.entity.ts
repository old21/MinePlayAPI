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
  JoinColumn,
} from 'typeorm';
import { User } from '../users.entity';
import { Session } from '../sessions/sessions.entity';
import { OTPProviders } from './otp.types';

@Entity('users_otp')
export class OTP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  provider: OTPProviders;

  @Column({ type: 'varchar', nullable: true })
  secret: string;

  @Column({ type: 'integer', nullable: true })
  code: number;

  @Column({ type: 'varchar', nullable: true })
  accountID: string;

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;

  @ManyToOne(() => User, (user) => user.totp)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Session, (session) => session.totp)
  @JoinColumn()
  createdBy: Session;

  @Column({ type: 'boolean', default: false })
  expired: boolean;

  @ManyToOne(() => Session, (session) => session.totp)
  @JoinColumn()
  removedBy: Session;

  @Column({ type: 'bigint', readonly: true, default: 0 })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}
