import { AutoMap } from "@automapper/classes";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  roles: string[];
}
