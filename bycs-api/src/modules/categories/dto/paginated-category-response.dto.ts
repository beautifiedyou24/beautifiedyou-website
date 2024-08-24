import { PaginatedBaseResponseDto } from "@common/dto/paginated-base-response.dto";
import { CategoryResponseDto } from "./category-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginatedCategoryResponseDto extends PaginatedBaseResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  items: CategoryResponseDto[];
}
