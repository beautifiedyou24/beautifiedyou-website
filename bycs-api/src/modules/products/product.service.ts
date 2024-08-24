import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { CategoryService } from "@categories/category.service";
import { BaseService } from "@common/base-service";
import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import slugify from "slugify";
import { CreateProductDto } from "./dto/create-product.dto";
import { DiscountDto } from "./dto/discount-dto";
import { PaginatedProductResponseDto } from "./dto/paginated-product-response.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { ProductStatsQueryDto } from "./dto/product-stats-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateSoldCountDto } from "./dto/update-sold-count.dto";
import { UpdateStockCountDto } from "./dto/update-stock-count.dto";
import { IProductService } from "./interfaces/product-service.interface";
import { Product } from "./models/product.model";
import { ProductRepository } from "./product.repository";

@Injectable()
export class ProductService
  extends BaseService<Product, CreateProductDto, UpdateProductDto, ProductResponseDto>
  implements IProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly categoryService: CategoryService,
  ) {
    super(productRepository, mapper, {
      modelClass: Product,
      createDtoClass: CreateProductDto,
      updateDtoClass: UpdateProductDto,
      responseDtoClass: ProductResponseDto,
    });
  }

  async createOneProduct(createDto: CreateProductDto): Promise<ProductResponseDto> {
    const categories = await this.categoryService.findAllCategoryByNames(createDto.categories);

    if (categories.length != createDto.categories.length) throw new NotFoundException("categories not found");

    // Increase productCount for each category
    for (const category of categories) {
      const currentCount =
        typeof category.productCount === "number" && !isNaN(category.productCount) ? category.productCount : 0;
      await this.categoryService.updateOneCategory(category.id, { productCount: currentCount + 1 });
    }

    createDto.slug = slugify(createDto.name, { lower: true, strict: true });

    const existed = await this.findOne({ filter: { slug: createDto.slug } });
    if (existed) throw new ConflictException("Product already exists, give a different product name");

    const product = await this.createOne(createDto);

    return product;
  }

  async createBulkProducts(createDtos: CreateProductDto[]): Promise<ProductResponseDto[]> {
    const createdProducts: ProductResponseDto[] = [];

    for (const createDto of createDtos) {
      const categories = await this.categoryService.findAllCategoryByNames(createDto.categories);

      if (categories.length != createDto.categories.length) {
        console.warn(`Skipping product ${createDto.name}: categories not found`);
        continue;
      }

      // Increase productCount for each category
      for (const category of categories) {
        const currentCount =
          typeof category.productCount === "number" && !isNaN(category.productCount) ? category.productCount : 0;
        await this.categoryService.updateOneCategory(category.id, { productCount: currentCount + 1 });
      }

      createDto.slug = slugify(createDto.name, { lower: true, strict: true });

      const existed = await this.findOne({ filter: { slug: createDto.slug } });
      if (existed) {
        console.warn(`Skipping product ${createDto.name}: already exists`);
        continue;
      }

      const product = await this.createOne(createDto);
      createdProducts.push(product);
    }

    return createdProducts;
  }

  async findAllProduct(query: ProductQueryDto): Promise<PaginatedProductResponseDto> {
    const { page, limit, sortBy, sortOrder, searchTerm, maxPrice, minPrice, categories } = query;
    const filter: any = {};

    if (searchTerm) {
      filter.$or = [{ name: new RegExp(searchTerm, "i") }, { details: new RegExp(searchTerm, "i") }];
    }

    if (maxPrice && minPrice) {
      filter.price = {
        $gte: minPrice,
        $lte: maxPrice,
      };
    }

    const parse = (categories: string): [string] => {
      try {
        let parsedCategories = JSON.parse(categories);
        parsedCategories = parsedCategories.map((c: string) => new RegExp(c, "i"));
        return parsedCategories;
      } catch (error) {
        throw new BadRequestException({ categories: "categories must be an array of strings" });
      }
    };

    if (categories) {
      const parsedCategories = parse(categories);
      filter.categories = { $in: parsedCategories };
    }

    let newSortBy = sortBy ?? "id";

    if (sortBy === "date") {
      newSortBy = "createdAt";
    }

    return this.paginate({
      page,
      limit,
      sortBy: newSortBy,
      sortOrder: sortOrder ?? "desc",
      filter: {
        ...filter,
      },
    });
  }

  async findAllProductByIds(productIds: string[]): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAllProductByIds(productIds);

    const foundProductIds = products.map((product) => product.id);
    const missingIds = productIds.filter((id) => !foundProductIds.includes(id));

    if (missingIds.length > 0) throw new NotFoundException(`following products not found: [${missingIds.join(", ")}]`);

    const mappedProducts = this.mapper.mapArray<Product, ProductResponseDto>(products, Product, ProductResponseDto);
    return mappedProducts;
  }

  async findProductStats(filter: ProductStatsQueryDto): Promise<{ [key: string]: any }> {
    // fetch all products
    const products = await this.productRepository.findAllProducts(filter);

    // get top 5 most sold products
    const top5SoldProducts = products.sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);

    const response = {
      top5SoldProducts: top5SoldProducts.map((product) => ({
        product: product.name,
        Sales: product.soldCount,
      })),
    };

    return response;
  }

  async updateStockCounts(products: UpdateStockCountDto[]): Promise<void> {

    const promises = products.map(async (product) => {
      const currentProduct = await this.productRepository.findById(product.id);

      if (!currentProduct) {
        throw new NotFoundException(`Product with ID ${product.id} not found`);
      }

      currentProduct.stockCount = product.imageObj.reduce((total, obj) => {
        const [, [, , stock]] = Object.entries(obj)[0] as [string, [string, string, number]];
        return total + stock;
      }, 0);

      currentProduct.meta.imageObj = product.imageObj;

      await this.productRepository.updateOne(product.id, currentProduct);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      throw new HttpException(
        'Failed to update stock counts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }


  async updateSoldCounts(products: UpdateSoldCountDto[]): Promise<void> {
    return await this.productRepository.updateAllSoldCount(products);
  }

  async updateOneDiscount(slug: string, discountDto: DiscountDto): Promise<ProductResponseDto> {
    // Fetch the product by slug
    const product = await this.findOne({ filter: { slug } });
    if (!product) {
      console.error(`Product with slug ${slug} not found.`);
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    product.discount = discountDto;

    // Update the product in the repository
    await this.productRepository.updateOne(product.id, product);

    return product;
  }
}
