import { Mapper, MappingProfile, createMap } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { Category } from "./models/category.model";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateCategoryDto, Category);
      createMap(mapper, UpdateCategoryDto, Category);
      createMap(mapper, Category, CategoryResponseDto);
    };
  }
}
