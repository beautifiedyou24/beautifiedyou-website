import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class Address {
  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  division: string;

  @ApiProperty()
  @IsString()
  subDivision: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  details: string;
}
