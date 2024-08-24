import { ApiProperty } from "@nestjs/swagger";

export class PaginationMeta {
  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalItemCount: number;

  @ApiProperty()
  totalFilteredItemCount: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPageCount: number;

  @ApiProperty()
  itemPerPage: number;
}
