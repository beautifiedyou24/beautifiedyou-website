import { BaseRepository } from "@common/base-repository";
import { IOrderRepository } from "./interfaces/order-repository.interface";
import { Order } from "./models/order.model";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeliveryStatus } from "./enums/delivery-status.enum";

@Injectable()
export class OrderRepository extends BaseRepository<Order> implements IOrderRepository<Order> {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {
    super(orderModel);
  }

  async findOneOrderByIdWithProducts(id: string): Promise<Order> {
    return await this.orderModel.findById(id).populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
      },
    });
  }

  async findOrders(options?: any): Promise<Order[]> {
    if (options) {
      return await this.orderModel.find({ ...options });
    }

    return await this.orderModel.find();
  }

  async findHighestOrderNumber(): Promise<number> {
    const order = await this.orderModel.findOne({}, {}, { sort: { orderNumber: -1 } });
    if (!order) return 10000;
    return order.orderNumber;
  }

  async findOrdersByDeliveryStatus(status: DeliveryStatus): Promise<number> {
    return this.orderModel.countDocuments({ deliveryStatus: status });
  }
}
