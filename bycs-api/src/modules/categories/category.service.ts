import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { BaseService } from "@common/base-service";
import { ConflictException, Injectable } from "@nestjs/common";
import slugify from "slugify";
import { CategoryRepository } from "./category.repository";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { PaginatedCategoryResponseDto } from "./dto/paginated-category-response.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ICategoryService } from "./interfaces/category-service.interface";
import { Category } from "./models/category.model";

@Injectable()
export class CategoryService
  extends BaseService<Category, CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto>
  implements ICategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super(categoryRepository, mapper, {
      modelClass: Category,
      createDtoClass: CreateCategoryDto,
      updateDtoClass: UpdateCategoryDto,
      responseDtoClass: CategoryResponseDto,
    });
  }

  async findOneCategoryByName(name: string): Promise<CategoryResponseDto> {
    const data = await this.categoryRepository.findOne({ filter: { name } });
    const category = this.mapper.map<Category, CategoryResponseDto>(data, Category, CategoryResponseDto);
    return category;
  }

  async findAllCategoryByNames(names: string[]): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAllCategoryByNames(names);

    const foundNames = categories.map((category) => category.name);
    const missingNames = names.filter((name) => !foundNames.includes(name));

    if (missingNames.length > 0) {
      return [];
    }

    const mappedCategories = this.mapper.mapArray<Category, CategoryResponseDto>(
      categories,
      Category,
      CategoryResponseDto,
    );
    return mappedCategories;
  }

  async createOneCategory(createDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const exist = await this.findOneCategoryByName(createDto.name);
    if (exist) throw new ConflictException({ name: "category already exists" });

    createDto.slug = slugify(createDto.name, { lower: true, strict: true });

    const existed = await this.findOne({ filter: { slug: createDto.slug } });
    if (existed) throw new ConflictException("Slug already exists, give a different category name");

    const category = await this.createOne(createDto);

    return category;
  }

  async findAllCategory(query: CategoryQueryDto): Promise<PaginatedCategoryResponseDto> {
    const { page, limit, sortBy, sortOrder, name } = query;

    const filter: any = {};
    if (name) filter.name = new RegExp(name, "i");

    const categories = await this.paginate({ page, limit, sortBy, sortOrder, filter });
    return categories;
  }

  async updateOneCategory(id: string, updateDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    // if (updateDto.name) {
    //   const exist = await this.findOneCategoryByName(updateDto.name);
    //   if (exist) throw new ConflictException({ name: "category already exists" });
    // }

    const updatedData = this.updateOne(id, updateDto);
    return updatedData;
  }
}
