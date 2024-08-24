import { AutoMap } from "@automapper/classes";
import { BaseResponseDto } from "@common/dto/base-response.dto";
import { Address } from "@common/models/address.model";
import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "@users/dto/user-response.dto";
import { OrderItemResponseDto } from "./order-item-response.dto";

export class OrderResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty({ required: false })
  user: UserResponseDto;

  @AutoMap()
  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @AutoMap()
  @ApiProperty()
  orderNumber: number;

  @AutoMap()
  @ApiProperty()
  totalPrice: number;

  @AutoMap()
  @ApiProperty({ type: Address })
  deliveryAddress: Address;

  @AutoMap()
  @ApiProperty()
  deliveryStatus: string;

  @AutoMap()
  @ApiProperty()
  paymentMethod: string;

  @AutoMap()
  @ApiProperty()
  shippingMethod: string;

  @AutoMap()
  @ApiProperty()
  customerName: string;

  @AutoMap()
  @ApiProperty({ required: false })
  email: string;

  @AutoMap()
  @ApiProperty({ required: true })
  phone_1: string;

  @AutoMap()
  @ApiProperty({ required: false })
  phone_2: string;

  @AutoMap()
  @ApiProperty({ required: true })
  date: string;
}
