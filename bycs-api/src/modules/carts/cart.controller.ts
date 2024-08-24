import { Public } from "@decorators/public.decorator";
import { ResponseMessage } from "@decorators/response-message.decorator";
import { Body, Controller, Delete, Get, HttpStatus, Logger, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { CartResponseDto } from "./dto/cart-response.dto";
import { CreateCartItemDto } from "./dto/create-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@ApiTags("carts")
@ApiBearerAuth()
@Controller({
  path: "carts",
  version: "1",
})
export class CartController {
  private readonly logger = new Logger(CartController.name);
  constructor(private readonly cartService: CartService) {}

  @Post("me/items")
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CartResponseDto,
  })
  @ApiBody({
    type: CreateCartItemDto,
  })
  @ResponseMessage("Created", HttpStatus.CREATED)
  async addCartItem(@Body() addCartItemDto: CreateCartItemDto): Promise<CartResponseDto> {
    return this.cartService.addCartItem(addCartItemDto);
  }

  @Public()
  @Get("/me")
  @ApiResponse({
    status: HttpStatus.OK,
    type: CartResponseDto,
  })
  async findOne(): Promise<CartResponseDto> {
    const userId = "663f1b4354f02fff07444bdc";
    return this.cartService.findOneCartByUserId(userId);
  }

  @Put("me/items")
  @ApiResponse({
    status: HttpStatus.OK,
    type: CartResponseDto,
  })
  @ApiBody({
    type: UpdateCartItemDto,
  })
  async update(@Body() updateCartItemDto: UpdateCartItemDto): Promise<CartResponseDto> {
    return await this.cartService.updateCartItem(updateCartItemDto);
  }

  @Delete("me")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ResponseMessage("Cart deleted successfully", HttpStatus.NO_CONTENT)
  async remove(): Promise<boolean> {
    const id = "";
    return await this.cartService.deleteOne(id);
  }
}
