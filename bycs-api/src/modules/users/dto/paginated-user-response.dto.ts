import { PaginatedBaseResponseDto } from "@common/dto/paginated-base-response.dto";
import { UserResponseDto } from "./user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginatedUserResponseDto extends PaginatedBaseResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  items: UserResponseDto[];
}
