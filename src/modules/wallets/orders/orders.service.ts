import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { User } from 'src/modules/users/users.entity';

@Injectable()
export class OrdersService {
    constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>) {}

    async create(sum: number, quantity: number, user: User): Promise<Order> {
        try {
            const order = await this.ordersRepository.create({ sum, quantity, user });

            return await this.ordersRepository.save(order);
        } catch(error) {
            console.error(error)
        }
    }
}
