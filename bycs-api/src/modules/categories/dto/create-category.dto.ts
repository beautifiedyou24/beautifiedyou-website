import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateCategoryDto {
  @AutoMap()
  @ApiProperty({ description: "name of the category" })
  @IsString()
  @Length(3, 255)
  @IsNotEmpty()
  name: string;

  slug: string;

  @AutoMap()
  @ApiProperty({ description: "details of the category", required: false })
  @IsString()
  @Length(3, 255)
  @IsOptional()
  details: string;

  @AutoMap()
  @ApiProperty({ description: "URL of the category image", required: false })
  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @AutoMap()
  @ApiProperty({ description: "Total Product Count", required: false })
  @IsNumber()
  @IsOptional()
  productCount: number;
}
