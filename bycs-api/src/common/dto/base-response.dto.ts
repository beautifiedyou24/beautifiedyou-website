import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  id: string;
}
