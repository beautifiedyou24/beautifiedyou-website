import { BaseQueryDto } from "@common/dto/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UserQueryDto extends BaseQueryDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  phone: string;
}
