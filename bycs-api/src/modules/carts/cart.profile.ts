import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { Cart } from "./models/cart.model";
import { CreateCartDto } from "./dto/create-cart.dto";
import { CartResponseDto } from "./dto/cart-response.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { ProductResponseDto } from "@products/dto/product-response.dto";
import { Product } from "@products/models/product.model";

@Injectable()
export class CartProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateCartDto, Cart);
      createMap(mapper, UpdateCartDto, Cart);
      createMap(
        mapper,
        Cart,
        CartResponseDto,
        forMember(
          (destination) => destination.items,
          mapFrom((source) => {
            const items = source.items?.map((item) => {
              const { quantity, product } = item;

              if (!product || typeof product === "string") return { quantity, product };

              const mappedProduct = mapper.map<Product, ProductResponseDto>(product, Product, ProductResponseDto);
              return { quantity, product: mappedProduct };
            });
            return items;
          }),
        ),
      );
    };
  }
}
