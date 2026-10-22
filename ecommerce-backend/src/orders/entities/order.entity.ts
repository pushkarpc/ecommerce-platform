import type { Relation } from 'typeorm';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../../enums/order-status.enum.js';
import { Product } from '../../products/entities/product.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  //Many orders belong to one specific user
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Explicitly renames foreign key column in database
  user: Relation<User>;

  //Many orders can purchase one specific product
  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' }) // Prevents deleting a product if it exists in an order log
  product: Relation<Product>;
}
