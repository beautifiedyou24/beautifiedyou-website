import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  roles: string[];
}
