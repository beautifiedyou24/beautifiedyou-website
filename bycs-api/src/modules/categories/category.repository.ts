import { BaseRepository } from "@common/base-repository";
import { ICategoryRepository } from "./interfaces/category-repository.interface";
import { Category } from "./models/category.model";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository<Category> {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {
    super(categoryModel);
  }

  async findAllCategoryByNames(names: string[]): Promise<Category[]> {
    return await this.categoryModel.find({ name: { $in: names } });
  }
}
