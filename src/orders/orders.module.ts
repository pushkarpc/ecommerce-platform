import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Order } from './entities/order.entity.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Order, User, Product])],
})
export class OrdersModule {}
