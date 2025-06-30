import { Entity, Column, OneToMany, PrimaryGeneratedColumn, AfterLoad } from "typeorm";
import { User } from '../users/users.entity';
import { Exclude } from 'class-transformer';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  prefix: string;

  @Column({ type: 'varchar', nullable: true })
  prefixColor: string;

  @Column({ type: 'varchar', nullable: true })
  nickColor: string;

  @Column({ type: 'varchar', nullable: true })
  messageColor: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'text' })
  permissions: string;

  @OneToMany((type) => User, (user) => user.role)
  users: User[];

  @Column({ type: 'boolean', default: false })
  isDonate: boolean;

  @Column({ type: 'integer', default: null })
  needForEquip: number;

  assets: RoleAssets;
}

interface RoleCard {
  front: any;
  rear: any;
}

export interface RoleAssets {
  card: RoleCard;
  tag: any;
}
