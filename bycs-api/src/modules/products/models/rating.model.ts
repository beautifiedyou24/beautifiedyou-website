import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsPositive, IsString } from "class-validator";

export class Rating {
  @IsString()
  userId: string;

  @IsInt()
  @IsPositive()
  @IsNumber()
  @Transform((value) => {
    return Number(value.value);
  })
  value: number;
}
