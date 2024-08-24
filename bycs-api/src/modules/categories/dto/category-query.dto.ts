import { BaseQueryDto } from "@common/dto/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CategoryQueryDto extends BaseQueryDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  name: string;
}
