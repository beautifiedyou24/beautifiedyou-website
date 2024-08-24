import { PaginatedBaseResponseDto } from "@common/dto/paginated-base-response.dto";
import { OrderResponseDto } from "./order-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginatedOrderResponseDto extends PaginatedBaseResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  items: OrderResponseDto[];
}
