import { ApiProperty } from "@nestjs/swagger";
import { DeliveryStatus } from "@orders/enums/delivery-status.enum";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class OrderStatsQueryDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  from: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  searchTerm: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsEnum(DeliveryStatus)
  @IsOptional()
  deliveryStatus: string;
}
