import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';


@Module({
  providers: [OrdersService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ Order ])
  ],
  exports: [OrdersService]
})
export class OrdersModule {}
