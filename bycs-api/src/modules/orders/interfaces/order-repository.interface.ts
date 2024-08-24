import { IBaseRepository } from "@common/interfaces/base-repository.interface";
import { BaseModel } from "@common/models/base.model";

export interface IOrderRepository<Order extends BaseModel> extends IBaseRepository<Order> {
  findOneOrderByIdWithProducts(id: string): Promise<Order>;
  findHighestOrderNumber(): Promise<number>;
}
