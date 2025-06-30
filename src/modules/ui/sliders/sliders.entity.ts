import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("sliders")
export class Slider {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar" })
    description: string;

    @Column({ type: "varchar" })
    slug: string;

    image: any;
}