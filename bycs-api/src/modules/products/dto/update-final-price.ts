import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateFinalPriceDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsNumber()
  finalPrice: number;
}
