import { PaginatedBaseResponseDto } from "@common/dto/paginated-base-response.dto";
import { ProductResponseDto } from "./product-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginatedProductResponseDto extends PaginatedBaseResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  items: ProductResponseDto[];
}
