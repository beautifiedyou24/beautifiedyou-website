import { AutoMap } from "@automapper/classes";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Discount } from "../models/discount.model";
import { ProductMeta } from "../models/product-meta.model";

export class ProductResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  slug: string;

  @AutoMap()
  @ApiProperty()
  price: number;

  @AutoMap()
  @ApiProperty()
  finalPrice: number;

  @AutoMap()
  @ApiProperty()
  stockCount: number;

  @AutoMap()
  @ApiProperty()
  soldCount: number;

  @AutoMap()
  @ApiProperty()
  details: string;

  @AutoMap()
  @ApiProperty({ type: [String] })
  categories: string[];

  @AutoMap()
  @ApiProperty({ type: [String] })
  images: string[];

  @AutoMap()
  @ApiProperty({ type: Discount })
  discount: Discount;

  @AutoMap()
  @ApiProperty()
  averageRating: number;

  @AutoMap()
  @ApiProperty({ type: ProductMeta })
  meta: ProductMeta;
}
