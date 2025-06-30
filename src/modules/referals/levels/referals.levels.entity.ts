import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Referal } from "../referals.entity";


/* 
    * REFERAL LEVELS
    *   displayName - Percents - needToUse
    *   1. BEGINNER - 2% - 0
    *   2. ADVANCED - 4% - 2
    *   3. STAR - 6% - 10
    *   4. MARKETER - 8% - 20
    *   5. SPONSOR - 10% - 50
    * 
*/
@Entity("referals_levels")
export class Referal_level {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    displayName: string;

    @Column({ type: "integer" })
    needToUse: number;

    @Column({ type: "integer" })
    percents: number;

    @Column({ type: "boolean", default: false })
    isVip: boolean;

    @OneToMany(() => Referal, (referal) => referal.level)
    referals: Referal[]
}