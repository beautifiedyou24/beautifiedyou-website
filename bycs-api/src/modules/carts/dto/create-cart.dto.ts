import { AutoMap } from "@automapper/classes";
import { CreateCartItemDto } from "./create-cart-item.dto";

export class CreateCartDto {
  @AutoMap()
  userId: string;

  @AutoMap()
  items: CreateCartItemDto[];
}
