import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BaseModel } from "@common/models/base.model";
import { AutoMap } from "@automapper/classes";

@Schema({ timestamps: true })
export class Category extends BaseModel {
  @AutoMap()
  @Prop({ required: true, unique: true })
  name: string;

  @AutoMap()
  @Prop({ required: true, unique: true })
  slug: string;

  @AutoMap()
  @Prop()
  details: string;

  @AutoMap()
  @Prop()
  image: string;

  @AutoMap()
  @Prop({ type: Number })
  productCount: number;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
