import { User } from 'src/modules/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { News } from '../news.entity';

@Entity("news_comments")
export class NewsComment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text" })
    text: string;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn()
    author: User

    @ManyToOne(() => News, (news) => news.comments)
    @JoinColumn()
    new: News
}