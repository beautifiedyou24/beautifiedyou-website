import { AutoMap } from "@automapper/classes";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class OrderStatsResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty({ required: true })
  processedOrders: number;

  @AutoMap()
  @ApiProperty({ required: true })
  dispatchedOrders: number;

  @AutoMap()
  @ApiProperty({ required: true })
  deliveredOrders: number;

  @AutoMap()
  @ApiProperty({ required: true })
  cancelledOrder: number;
}
