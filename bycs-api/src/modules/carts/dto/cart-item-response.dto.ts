import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { ProductResponseDto } from "@products/dto/product-response.dto";

export class CartItemResponseDto {
  @AutoMap()
  @ApiProperty()
  quantity: number;

  @AutoMap()
  @ApiProperty({ type: ProductResponseDto })
  product: ProductResponseDto;
}
