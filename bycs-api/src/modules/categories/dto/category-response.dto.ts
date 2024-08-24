import { AutoMap } from "@automapper/classes";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  slug: string;

  @AutoMap()
  @ApiProperty()
  details: string;

  @AutoMap()
  @ApiProperty()
  image: string;

  @AutoMap()
  @ApiProperty()
  productCount: number;
}
