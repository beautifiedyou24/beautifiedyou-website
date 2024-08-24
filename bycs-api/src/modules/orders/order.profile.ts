import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { Order } from "./models/order.model";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderResponseDto } from "./dto/order-response.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ProductResponseDto } from "@products/dto/product-response.dto";
import { Product } from "@products/models/product.model";

@Injectable()
export class OrderProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateOrderDto, Order);
      createMap(mapper, UpdateOrderDto, Order);
      createMap(
        mapper,
        Order,
        OrderResponseDto,
        forMember(
          (destination) => destination.user,
          mapFrom((source) => {
            return source.user as any;
          }),
        ),
        forMember(
          (destination) => destination.items,
          mapFrom((source) => {
            const items = source.items?.map((item) => {
              const { quantity, color, product } = item;

              if (!product || typeof product === "string") return { quantity, product };

              const mappedProduct = mapper.map<Product, ProductResponseDto>(product, Product, ProductResponseDto);
              return { quantity, color: color, product: mappedProduct };
            });
            return items;
          }),
        ),
      );
    };
  }
}
