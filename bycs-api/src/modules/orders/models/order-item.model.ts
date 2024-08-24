import { AutoMap } from "@automapper/classes";
import { ObjectId } from "@database/types/object-id.type";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "@products/models/product.model";
import { HydratedDocument } from "mongoose";

export class OrderItem {
  @AutoMap()
  @Prop({ required: true, immutable: true })
  quantity: number;

  @AutoMap()
  @Prop({ required: true, immutable: true })
  color: string;

  @AutoMap()
  @Prop({ type: ObjectId, ref: "Product", required: true })
  product: string | Product;

  // price at the time of order
  @AutoMap()
  @Prop({ type: Number, required: true, immutable: true })
  pricePerItem: number;
}

export type OrderItemDocument = HydratedDocument<OrderItem>;
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
