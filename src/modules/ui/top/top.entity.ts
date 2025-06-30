import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TopBlock {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "varchar" })
    description: string;

    @Column({ type: "boolean", default: true})
    isActive: boolean;

    background: any;

    render: any;
}