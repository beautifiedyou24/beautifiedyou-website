import { Public } from "@decorators/public.decorator";
import { ResponseMessage } from "@decorators/response-message.decorator";
import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UrlParameterPipe } from "src/pipes/url-parameter.pipe";
import { CreateProductDto } from "./dto/create-product.dto";
import { DiscountDto } from "./dto/discount-dto";
import { PaginatedProductResponseDto } from "./dto/paginated-product-response.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { ProductStatsQueryDto } from "./dto/product-stats-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@ApiTags("products")
@ApiBearerAuth()
@Controller({
  path: "products",
  version: "1",
})
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProductResponseDto,
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @ResponseMessage("Created", HttpStatus.CREATED)
  async create(@Body() CreateProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return await this.productService.createOneProduct(CreateProductDto);
  }

  @Post("bulk")
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: [ProductResponseDto],
  })
  @ApiBody({
    type: [CreateProductDto],
  })
  @ResponseMessage("Bulk Created", HttpStatus.CREATED)
  async createBulk(@Body() createProductDtos: CreateProductDto[]): Promise<ProductResponseDto[]> {
    return await this.productService.createBulkProducts(createProductDtos);
  }

  @Public()
  @Get("/stats")
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object,
  })
  async findProductStats(@Query() query: ProductStatsQueryDto): Promise<{ [key: string]: any }> {
    return await this.productService.findProductStats(query);
  }

  @Public()
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedProductResponseDto,
  })
  async findAll(@Query() query: ProductQueryDto): Promise<PaginatedProductResponseDto> {
    return await this.productService.findAllProduct(query);
  }

  @Public()
  @Get(":slug")
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductResponseDto,
  })
  async findOne(@Param("slug") slug: string): Promise<ProductResponseDto> {
    return this.productService.findOne({ filter: { slug } });
  }

  @Put(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductResponseDto,
  })
  @ApiBody({
    type: UpdateProductDto,
  })
  async update(
    @Param("id", UrlParameterPipe) id: string,
    @Body() UpdateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productService.updateOne(id, UpdateProductDto);
  }

  @Put(":slug/discount")
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductResponseDto,
  })
  @ApiBody({
    type: DiscountDto,
  })
  async updateDiscount(@Param("slug") slug: string, @Body() discountDto: DiscountDto): Promise<ProductResponseDto> {
    return await this.productService.updateOneDiscount(slug, discountDto);
  }

  @Delete(":id")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ResponseMessage("Product deleted successfully", HttpStatus.NO_CONTENT)
  async remove(@Param("id", UrlParameterPipe) id: string): Promise<boolean> {
    return await this.productService.deleteOne(id);
  }
}
