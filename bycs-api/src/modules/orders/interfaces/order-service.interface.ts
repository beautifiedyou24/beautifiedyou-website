import { IBaseService } from "@common/interfaces/base-service.interface";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { OrderResponseDto } from "../dto/order-response.dto";
import { Order } from "../models/order.model";
import { OrderQueryDto } from "@orders/dto/order-query.dto";
import { PaginatedOrderResponseDto } from "@orders/dto/paginated-order-response.dto";

export interface IOrderService extends IBaseService<Order, CreateOrderDto, UpdateOrderDto, OrderResponseDto> {
  createOneOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>;
  findOneOrderById(id: string): Promise<OrderResponseDto>;
  findAllOrder(query: OrderQueryDto): Promise<PaginatedOrderResponseDto>;
}
