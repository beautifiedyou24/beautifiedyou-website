import { IBaseService } from "@common/interfaces/base-service.interface";
import { CreateCartDto } from "../dto/create-cart.dto";
import { UpdateCartDto } from "../dto/update-cart.dto";
import { CartResponseDto } from "../dto/cart-response.dto";
import { Cart } from "../models/cart.model";
import { CreateCartItemDto } from "@carts/dto/create-cart-item.dto";
import { CartItem } from "@carts/models/cart-item.model";
import { UpdateCartItemDto } from "@carts/dto/update-cart-item.dto";

export interface ICartService extends IBaseService<Cart, CreateCartDto, UpdateCartDto, CartResponseDto> {
  findOneCartByUserId(userId: string): Promise<CartResponseDto>;
  isItemExist(productId: string, items: CartItem[]): boolean;
  addCartItem(addCartItemDto: CreateCartItemDto): Promise<CartResponseDto>;
  updateCartItem(updateCartItemDto: UpdateCartItemDto): Promise<CartResponseDto>;
}
