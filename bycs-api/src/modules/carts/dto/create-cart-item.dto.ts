import { AutoMap } from "@automapper/classes";
import { IsObjectId } from "@decorators/is-object-id.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateCartItemDto {
  @AutoMap()
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  quantity: number;

  @AutoMap()
  @ApiProperty()
  @IsObjectId()
  @IsString()
  productId: string;
}
