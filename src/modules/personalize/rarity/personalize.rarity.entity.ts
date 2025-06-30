import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Personalize } from '../personalize.entity';

@Entity("personalization_rarity")
export class PersonalizeRarity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "varchar" })
    slug: string;

    @Column({ type: "varchar" })
    background: string;

    @Column({ type: "varchar" })
    text: string;

    @OneToMany(() => Personalize, item => item.rarity)
    @JoinColumn()
    items: Personalize[]
}