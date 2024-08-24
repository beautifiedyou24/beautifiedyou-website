import { AutoMap } from "@automapper/classes";
import { Address } from "@common/models/address.model";
import { ApiProperty } from "@nestjs/swagger";
import { IsUniqueProductId } from "@orders/decorators/is-unique-productid.decorator";
import { PaymentMethod } from "@orders/enums/payment-method.enum";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateOrderItemDto } from "./create-order-item.dto";
import { DeliveryStatus } from "@orders/enums/delivery-status.enum";

export class CreateOrderDto {
  @AutoMap()
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsUniqueProductId()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  @IsArray()
  items: CreateOrderItemDto[];

  @AutoMap()
  @ApiProperty({ type: Address })
  @ValidateNested()
  @Type(() => Address)
  @IsObject()
  @IsNotEmpty()
  deliveryAddress: Address;

  @AutoMap()
  @ApiProperty()
  @IsEnum(DeliveryStatus)
  @IsString()
  @IsOptional()
  deliveryStatus: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shippingMethod: string;

  @AutoMap()
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone_1: string;

  @AutoMap()
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone_2: string;

  @AutoMap()
  @ApiProperty()
  @IsEnum(PaymentMethod)
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @AutoMap()
  @ApiProperty({ required: true })
  @IsString()
  date: string;
}
