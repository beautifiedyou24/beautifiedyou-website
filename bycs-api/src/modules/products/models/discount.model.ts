import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class Discount {
  @AutoMap()
  @ApiProperty()
  @Max(100)
  @Min(0)
  @IsNumber()
  @Transform((value) => {
    return Number(value.value);
  })
  percentage: number;

  @AutoMap()
  @ApiProperty({ type: Date })
  @IsDateString()
  startAt: Date;

  @AutoMap()
  @ApiProperty({ type: Date })
  @IsDateString()
  endAt: Date;

  @AutoMap()
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  details: string;
}
