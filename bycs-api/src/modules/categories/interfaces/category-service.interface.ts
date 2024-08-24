import { IBaseService } from "@common/interfaces/base-service.interface";
import { Category } from "../models/category.model";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { CategoryResponseDto } from "../dto/category-response.dto";
import { PaginatedCategoryResponseDto } from "@categories/dto/paginated-category-response.dto";
import { CategoryQueryDto } from "@categories/dto/category-query.dto";

export interface ICategoryService
  extends IBaseService<Category, CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto> {
  findOneCategoryByName(name: string): Promise<CategoryResponseDto>;
  findAllCategory(query: CategoryQueryDto): Promise<PaginatedCategoryResponseDto>;
  findAllCategoryByNames(names: string[]): Promise<CategoryResponseDto[]>;
  updateOneCategory(id: string, updateDto: UpdateCategoryDto): Promise<CategoryResponseDto>;
}
