import { AutoMap } from "@automapper/classes";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { CartItemResponseDto } from "./cart-item-response.dto";

export class CartResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];
}
