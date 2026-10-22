import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum.js';
import { Product } from '../products/entities/product.entity.js';
import { User } from '../users/entities/user.entity.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Order } from './entities/order.entity.js';

@Injectable()
export class OrdersService {
  // Inject the global DataSource object to control manual transactions via QueryRunner
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(userId: string, productId: number, quantity: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect the query runner and start the transaction block
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Find the product inside the transaction block
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' }, // Prevents concurrent requests from reading stale stock
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // 2. Veridy stock availability
      if (product.stock < quantity) {
        throw new BadRequestException(`Insufficient stock. Only ${product.stock} items left.`);
      }
      // 3. Deduct stock and save using the transaction manager
      product.stock -= quantity;
      await queryRunner.manager.save(Product, product);

      //4. Find the user placing the order
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 5. Calculate pricing and save the new Order Entity
      const totalPrice = product.price * quantity;
      const order = queryRunner.manager.create(Order, {
        user: user,
        product: product,
        quantity: quantity,
        totalPrice: totalPrice,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // 6. Commit transaction to disk permanently
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (err) {
      // If ANY error occurs during the block, undo all changes entirely
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Always release the database connection runner back to the global pool
      await queryRunner.release();
    }
  }

  async findAllOrders() {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    const queryResult = await queryBuilder.getMany();
    return queryResult;
  }

  async findOrderbyId(id: string) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    queryBuilder.andWhere('order.id = :id', { id: id });

    const order = await queryBuilder.getOne();
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
