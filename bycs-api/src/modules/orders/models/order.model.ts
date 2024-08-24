import { AutoMap } from "@automapper/classes";
import { Address } from "@common/models/address.model";
import { BaseModel } from "@common/models/base.model";
import { ObjectId } from "@database/types/object-id.type";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DeliveryStatus } from "@orders/enums/delivery-status.enum";
import { PaymentMethod } from "@orders/enums/payment-method.enum";
import { User } from "@users/models/user.model";
import { HydratedDocument } from "mongoose";
import { OrderItem } from "./order-item.model";

@Schema({ timestamps: true })
export class Order extends BaseModel {
  @AutoMap()
  @Prop({ type: Number, unique: true, immutable: true, required: true })
  // auto increment, start from 10000
  orderNumber: number;

  @AutoMap()
  @Prop({ type: ObjectId, ref: "User" })
  user: string | User;

  @AutoMap()
  @Prop({ type: [{ type: OrderItem }], required: true })
  items: OrderItem[];

  @AutoMap()
  @Prop({ type: Number, immutable: true, required: true })
  totalPrice: number;

  @AutoMap()
  @Prop({ type: Address, required: true })
  deliveryAddress: Address;

  @AutoMap()
  @Prop({ type: String, enum: DeliveryStatus, required: true, default: DeliveryStatus.Processing })
  deliveryStatus: string;

  @AutoMap()
  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  customerName: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  shippingMethod: string;

  @AutoMap()
  @Prop({ type: String, required: false })
  email: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  phone_1: string;

  @AutoMap()
  @Prop({ type: String, required: false })
  phone_2: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  date: string;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
