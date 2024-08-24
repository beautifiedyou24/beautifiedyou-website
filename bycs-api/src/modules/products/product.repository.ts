import { BaseRepository } from "@common/base-repository";
import { IProductRepository } from "./interfaces/product-repository.interface";
import { Product } from "./models/product.model";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateSoldCountDto } from "./dto/update-sold-count.dto";

@Injectable()
export class ProductRepository extends BaseRepository<Product> implements IProductRepository<Product> {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {
    super(productModel);
  }

  async findAllProductByIds(productIds: string[]): Promise<Product[]> {
    return await this.productModel.find({ _id: { $in: productIds } });
  }

  async findAllProducts(options?: any): Promise<Product[]> {
    if (options) {
      return await this.productModel.find({ ...options });
    }

    return await this.productModel.find();
  }

  async updateAllSoldCount(products: UpdateSoldCountDto[]): Promise<void> {
    const bulkOptions = products.map((product) => ({
      updateOne: {
        filter: { _id: product.id },
        update: { $inc: { soldCount: product.soldCount } },
      },
    }));

    await this.productModel.bulkWrite(bulkOptions);
  }
}
