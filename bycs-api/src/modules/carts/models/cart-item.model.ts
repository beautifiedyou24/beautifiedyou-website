import { AutoMap } from "@automapper/classes";
import { ObjectId } from "@database/types/object-id.type";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "@products/models/product.model";
import { HydratedDocument } from "mongoose";

export class CartItem {
  @AutoMap()
  @Prop({ required: true })
  quantity: number;

  @AutoMap()
  @Prop({ type: ObjectId, ref: "Product", required: true })
  product: string | Product;
}

export type CartItemDocument = HydratedDocument<CartItem>;
export const CartItemSchema = SchemaFactory.createForClass(CartItem);
