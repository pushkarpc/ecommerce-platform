import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import type { Relation } from 'typeorm';

@Entity('users') // Defines PostgreSQL table name
export class User {
  @PrimaryGeneratedColumn('uuid') // Automatically generates unique uuids
  id: string;

  @Column({ unique: true, type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  // One user can have many orders.
  // 'order => order.user' maps the inverse side of the relationship.
  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Relation<Order[]>;
}
