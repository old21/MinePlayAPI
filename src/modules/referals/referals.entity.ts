import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Referal_level } from './levels/referals.levels.entity';


@Entity("referals")
export class Referal {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "integer", default: 0 })
    used: number;

    @Column({ type: "integer", default: 0 })
    earned: number;

    @JoinColumn()
    @OneToOne(type => User, user => user.referal)
    user: User;

    @Column({ type: "boolean", default: false })
    isVip: boolean;

    @Column({ type: "varchar", default: null })
    vipName: string;

    @OneToMany(() => User, (user) => user.invitedBy)
    invited: User[]

    level: Referal_level

    @Column({ type: 'bigint', default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.round(new Date().getTime() / 1000);
    }
}