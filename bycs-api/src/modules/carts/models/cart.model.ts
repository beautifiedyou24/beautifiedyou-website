import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseModel } from "@common/models/base.model";
import { AutoMap } from "@automapper/classes";
import { CartItem } from "./cart-item.model";
import { ObjectId } from "@database/types/object-id.type";
import { User } from "@users/models/user.model";

@Schema({ timestamps: true })
export class Cart extends BaseModel {
  @AutoMap()
  @Prop({ type: ObjectId, ref: "User", unique: true, required: true })
  user: string | User;

  @AutoMap()
  @Prop({ type: [{ type: CartItem }], required: true })
  items: CartItem[];
}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);
