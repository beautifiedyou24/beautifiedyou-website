import { AutoMap } from "@automapper/classes";
import { IsObjectId } from "@decorators/is-object-id.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateOrderItemDto {
  @AutoMap()
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  quantity: number;

  @AutoMap()
  @ApiProperty()
  @IsString()
  color: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  image: string;

  @AutoMap()
  @ApiProperty()
  @IsObjectId()
  @IsString()
  productId: string;
}
