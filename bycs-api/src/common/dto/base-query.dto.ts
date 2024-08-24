import { SortOrder } from "@common/enums/sort-order.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class BaseQueryDto {
  @ApiProperty({ default: 1, required: false })
  @IsPositive({ message: "page must be a positive number" })
  @IsNumber()
  @Transform((value) => {
    return Number(value.value);
  })
  @IsOptional()
  page: number;

  @ApiProperty({ default: 10, required: false })
  @IsPositive({ message: "limit must be a positive number" })
  @IsNumber()
  @Transform((value) => {
    return Number(value.value);
  })
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sortBy: string;

  @ApiProperty({ required: false })
  @IsEnum(SortOrder)
  @IsString()
  @IsOptional()
  sortOrder: SortOrder;
}
