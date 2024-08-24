import { BadRequestException, Injectable, NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { ICartService } from "./interfaces/cart-service.interface";
import { CartRepository } from "./cart.repository";
import { Cart } from "./models/cart.model";
import { CartResponseDto } from "./dto/cart-response.dto";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { BaseService } from "@common/base-service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CreateCartItemDto } from "./dto/create-cart-item.dto";
import { CartItem } from "./models/cart-item.model";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { ProductService } from "@products/product.service";

@Injectable()
export class CartService
  extends BaseService<Cart, CreateCartDto, UpdateCartDto, CartResponseDto>
  implements ICartService
{
  constructor(
    private readonly cartRepository: CartRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly productService: ProductService,
  ) {
    super(cartRepository, mapper, {
      modelClass: Cart,
      createDtoClass: CreateCartDto,
      updateDtoClass: UpdateCartDto,
      responseDtoClass: CartResponseDto,
    });
  }

  async findOneCartByUserId(userId: string): Promise<CartResponseDto> {
    const data = await this.cartRepository.findOneCartByUserIdWithProducts(userId);

    if (!data) throw new NotFoundException("cart not found");

    const cart = this.mapper.map<Cart, CartResponseDto>(data, Cart, CartResponseDto);
    return cart;
  }

  isItemExist(productId: string, items: CartItem[]): boolean {
    for (const item of items) {
      if (productId == item.product) return true;
    }
    return false;
  }

  async addCartItem(addCartItemDto: CreateCartItemDto): Promise<CartResponseDto> {
    const userId = "663f1b4354f02fff07444bdc";
    let cart = await this.cartRepository.findOneCartByUserId(userId);

    const product = await this.productService.findOneById(addCartItemDto.productId);

    if (!product) throw new NotFoundException("product not found");

    if (product.stockCount < addCartItemDto.quantity) throw new PreconditionFailedException("less stock count");

    if (!cart) {
      cart = await this.cartRepository.saveOne({ user: userId, items: [] });
    }

    if (!this.isItemExist(addCartItemDto.productId, cart.items)) {
      const { quantity, productId } = addCartItemDto;
      cart.items.push({ quantity, product: productId });
      await this.cartRepository.updateOne(cart.id, { items: cart.items });
    } else {
      throw new BadRequestException("item already added");
    }

    const cartResponse = await this.findOneCartByUserId(userId);
    return cartResponse;
  }

  async updateCartItem(updateCartItemDto: UpdateCartItemDto): Promise<CartResponseDto> {
    const userId = "663f1b4354f02fff07444bdc";
    const cart = await this.cartRepository.findOneCartByUserId(userId);

    if (!cart) throw new NotFoundException("cart not found");

    // update count
    for (const item of cart.items) {
      if (item.product == updateCartItemDto.productId) {
        item.quantity = updateCartItemDto.quantity;
      }
    }

    // update to database
    await this.cartRepository.updateOne(cart.id, { items: cart.items });

    const cartResponse = await this.findOneCartByUserId(userId);
    return cartResponse;
  }
}
