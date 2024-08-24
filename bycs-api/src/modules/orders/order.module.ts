import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { OrderProfile } from "./order.profile";
import { Order, OrderSchema } from "./models/order.model";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductModule } from "@products/product.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderProfile, OrderRepository],
})
export class OrderModule {}
