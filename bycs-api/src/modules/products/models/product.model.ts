import { AutoMap } from "@automapper/classes";
import { BaseModel } from "@common/models/base.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Discount } from "./discount.model";
import { ProductMeta } from "./product-meta.model";
import { Rating } from "./rating.model";

@Schema({ timestamps: true })
export class Product extends BaseModel {
  @AutoMap()
  @Prop({ type: String, required: true })
  name: string;

  @AutoMap()
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @AutoMap()
  @Prop({ type: Number, required: true })
  price: number;

  @AutoMap()
  // virtual property, price after discount
  finalPrice: number;

  @AutoMap()
  @Prop({ type: Number, required: true, default: 0 })
  stockCount: number;

  @AutoMap()
  @Prop({ type: Number, required: false, default: 0 })
  soldCount: number;

  @AutoMap()
  @Prop({ type: String })
  details: string;

  @AutoMap()
  @Prop({ type: [String], required: true })
  categories: string[];

  @AutoMap()
  @Prop({ type: [String] })
  images: string[];

  @AutoMap()
  @Prop({ type: Discount })
  discount: Discount;

  @Prop({ type: [Rating] })
  ratings: Rating[];

  @AutoMap()
  // virtual property
  averageRating: number;

  @AutoMap()
  @Prop({ type: ProductMeta })
  meta: ProductMeta;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual("averageRating").get(function (this: ProductDocument) {
  if (!this.ratings || this.ratings.length === 0) {
    return 0;
  }
  const sum = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
  return sum / this.ratings.length;
});

ProductSchema.virtual("finalPrice").get(function (this: ProductDocument) {
  // const isDiscountValid = () => {
  //   const now = new Date(Date.now());
  //   const startAt = new Date(this.discount.startAt);
  //   const endAt = new Date(this.discount.endAt);
  //   return startAt <= now && now <= endAt;
  // };

  // if (!this.discount || !isDiscountValid()) {
  //   return this.price;
  // }

  if (!this.discount) {
    return this.price;
  }

  return Math.round(this.price - this.price * this.discount.percentage);
});
