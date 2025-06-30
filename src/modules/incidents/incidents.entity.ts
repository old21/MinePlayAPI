import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';
import { Session } from '../users/sessions/sessions.entity';
import { IncidentStatus } from './incident.types';

@Entity("incidents")
export class Incident {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text" })
    stackTrace: string;

    @Column({ type: "text" })
    ip: string;

    @Column({ type: "integer", default: 1 })
    victims: number;

    @Column({ type: "varchar" })
    status: IncidentStatus;

    @Column({ type: "text", default: null })
    solution: string;

    @Column({ type: 'bigint', readonly: true, default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.floor(Date.now() / 1000);
    }

    @Column({ type: 'bigint', default: 0 })
    updatedAt: number;

    @BeforeInsert()
    updateDateUpdate() {
        this.updatedAt = Math.floor(Date.now() / 1000);
    }
}