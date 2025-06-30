import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from './bonus.types';
@Entity('bonuses')
export class Bonus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'integer' })
  projectId: Projects;
}
