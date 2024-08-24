import { AutoMap } from "@automapper/classes";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class BaseModel {
  @AutoMap()
  id: string;

  @AutoMap()
  @Prop({ type: Date })
  createdAt: Date;

  @AutoMap()
  @Prop({ type: Date })
  updatedAt: Date;

  @AutoMap()
  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export type BaseDocument = HydratedDocument<BaseModel>;
export const BaseSchema = SchemaFactory.createForClass(BaseModel);
