import { IBaseRepository } from "@common/interfaces/base-repository.interface";
import { BaseModel } from "@common/models/base.model";

export interface ICartRepository<Cart extends BaseModel> extends IBaseRepository<Cart> {
  findOneCartByUserId(userId: string): Promise<Cart>;
  findOneCartByUserIdWithProducts(userId: string): Promise<Cart>;
}
