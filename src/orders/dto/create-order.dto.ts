import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum.js';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus = OrderStatus.PENDING;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  productId: number;
}
