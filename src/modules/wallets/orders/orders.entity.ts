import { User } from 'src/modules/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BeforeInsert, ManyToOne } from 'typeorm';

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    //Итоговая сумма
    @Column({ type: "integer" })
    sum: number;

    //Количество монет
    @Column({ type: "integer" })
    quantity: number;

    @ManyToOne(type => User, user => user.orders)
    @JoinColumn()
    user: User

    @Column({ type: 'bigint', readonly: true, default: 0 })
    createdAt: number;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = Math.round(new Date().getTime() / 1000);
    }
}