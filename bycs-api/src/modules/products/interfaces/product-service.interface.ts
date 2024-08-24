import { IBaseService } from "@common/interfaces/base-service.interface";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { ProductResponseDto } from "../dto/product-response.dto";
import { Product } from "../models/product.model";
import { UpdateStockCountDto } from "@products/dto/update-stock-count.dto";
import { ProductQueryDto } from "@products/dto/product-query.dto";
import { PaginatedProductResponseDto } from "@products/dto/paginated-product-response.dto";

export interface IProductService extends IBaseService<Product, CreateProductDto, UpdateProductDto, ProductResponseDto> {
  createOneProduct(createDto: CreateProductDto): Promise<ProductResponseDto>;
  findAllProduct(query: ProductQueryDto): Promise<PaginatedProductResponseDto>;
  findAllProductByIds(productIds: string[]): Promise<ProductResponseDto[]>;
  updateStockCounts(products: UpdateStockCountDto[]): Promise<void>;
}
