import { AutoMap } from "@automapper/classes";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Address } from "@common/models/address.model";

export class UserResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  email: string;

  @AutoMap()
  @ApiProperty()
  phone: string;

  @AutoMap()
  @ApiProperty()
  dob: string;

  @AutoMap()
  @ApiProperty()
  gender: string;

  @AutoMap()
  @ApiProperty({ type: Address })
  address: Address;

  @AutoMap()
  @ApiProperty()
  roles: string[];
}
