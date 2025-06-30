import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Anchor, Vote } from './news.interfaces';
import { NewsCategory } from './categories/news.categories.entity';
import { NewsComment } from './comments/news.comments.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text' })
  shortStory: string;

  @Column({ type: 'text' })
  fullStory: string;

  @Column({ type: 'integer', default: 0 })
  views: number;

  @Column({ type: 'integer', default: 0 })
  likes: number;

  @Column({ type: 'integer' })
  time: number;

  @Column({ type: 'json', default: null })
  anchors: Anchor[];

  @Column({ type: 'json', default: null })
  vote: Vote[];

  @ManyToOne(() => NewsCategory, (category) => category.news)
  @JoinColumn()
  category: NewsCategory;

  @ManyToMany(() => User, (user) => user.likes)
  userLikes: User[];

  @Column({ type: 'bigint', readonly: true, default: 0 })
  createdAt: number;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = Math.round(new Date().getTime() / 1000);
  }

  @Column({ type: 'bigint', default: 0 })
  updatedAt: number;

  @BeforeUpdate()
  updateDateUpdate() {
    this.updatedAt = Math.round(new Date().getTime() / 1000);
  }

  @ManyToOne(() => User, (user) => user.news)
  @JoinColumn()
  author: User;

  @OneToMany(() => NewsComment, (comment) => comment.new)
  comments: NewsComment[];

  preview: any;

  placement: string;

  isLiked: boolean;
}
