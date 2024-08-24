import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@users/enums/role.enum";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from "class-validator";
import { Address } from "../../../common/models/address.model";
import { Type } from "class-transformer";
import { Gender } from "@users/enums/gender.enum";

export class CreateUserDto {
  @AutoMap()
  @ApiProperty()
  @IsString()
  @Length(3, 255)
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @AutoMap()
  @ApiProperty({ required: false })
  @Matches(/^(?:(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4})$/, {
    message: "must be a valid date. eg: '17-12-1999'",
  })
  @IsString()
  @IsOptional()
  dob: string;

  @AutoMap()
  @ApiProperty({ required: false })
  @IsEnum(Gender)
  @IsString()
  @IsOptional()
  gender: string;

  @AutoMap()
  @ApiProperty({ type: Address, required: false })
  @ValidateNested()
  @Type(() => Address)
  @IsObject()
  @IsOptional()
  address: Address;

  @AutoMap()
  @ApiProperty()
  @IsEnum(Role, { each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  @IsArray()
  roles: string[];
}
