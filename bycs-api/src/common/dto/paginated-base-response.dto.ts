import { ApiProperty } from "@nestjs/swagger";
import { PaginationMeta } from "./pagination-meta.dto";

export class PaginatedBaseResponseDto {
  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;

  @ApiProperty({ type: [Object] })
  items: any[];
}

/**
 * Override 'items' property in child dto with appropriate type
 * export class PaginatedUserResponseDto extends PaginatedBaseResponseDto {
 *    @ApiProperty({ type: [UserResponseDto] })
 *    items: UserResponseDto[];
 * }
 */
