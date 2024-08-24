import { BaseQueryDto } from "@common/dto/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ProductQueryDto extends BaseQueryDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  searchTerm: string;

  @ApiProperty({ type: Number, required: false })
  @Min(0)
  @IsNumber()
  @Transform((value) => {
    return Number(value.value);
  })
  @IsOptional()
  minPrice: number;

  @ApiProperty({ type: Number, required: false })
  @Min(0)
  @IsNumber()
  @Transform((value) => {
    return Number(value.value);
  })
  @IsOptional()
  maxPrice: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  categories: string;
}
