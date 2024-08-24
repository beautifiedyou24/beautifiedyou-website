import { IBaseRepository } from "@common/interfaces/base-repository.interface";
import { BaseModel } from "@common/models/base.model";
import { UpdateStockCountDto } from "@products/dto/update-stock-count.dto";

export interface IProductRepository<Product extends BaseModel> extends IBaseRepository<Product> {
  findAllProductByIds(productIds: string[]): Promise<Product[]>;
  // updateAllStockCount(products: UpdateStockCountDto[]): Promise<void>;
}
