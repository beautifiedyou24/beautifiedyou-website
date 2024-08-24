import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { Product } from "./models/product.model";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateProductDto, Product);
      createMap(mapper, UpdateProductDto, Product);
      createMap(
        mapper,
        Product,
        ProductResponseDto,
        forMember(
          (destination) => destination.categories,
          mapFrom((source) => source.categories),
        ),
        forMember(
          (destination) => destination.images,
          mapFrom((source) => source.images),
        ),
      );
    };
  }
}
