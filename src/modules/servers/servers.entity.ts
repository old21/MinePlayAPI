import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';
import { ServerStatus } from './servers.interfaces';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  cols: [{ key: string; value: string }];

  @Column({ type: 'bigint', default: 0 })
  lastSeenAt: number;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'boolean', default: true })
  isIndex: boolean;

  status: ServerStatus;
}
