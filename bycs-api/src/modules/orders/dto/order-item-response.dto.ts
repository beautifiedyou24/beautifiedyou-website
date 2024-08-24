import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { ProductResponseDto } from "@products/dto/product-response.dto";

export class OrderItemResponseDto {
  @AutoMap()
  @ApiProperty()
  quantity: number;

  @AutoMap()
  @ApiProperty({ type: ProductResponseDto })
  product: ProductResponseDto;

  @AutoMap()
  @ApiProperty()
  color: string;

  @AutoMap()
  @ApiProperty()
  image: string;

  @AutoMap()
  @ApiProperty()
  pricePerItem: number;
}
