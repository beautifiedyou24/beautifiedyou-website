import { BaseRepository } from "@common/base-repository";
import { ICartRepository } from "./interfaces/cart-repository.interface";
import { Cart } from "./models/cart.model";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CartRepository extends BaseRepository<Cart> implements ICartRepository<Cart> {
  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {
    super(cartModel);
  }

  async findOneCartByUserId(userId: string): Promise<Cart> {
    return await this.findOne({ filter: { user: userId } });
  }

  async findOneCartByUserIdWithProducts(userId: string): Promise<Cart> {
    return await this.cartModel.findOne({ user: userId }).populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
      },
    });
  }
}
