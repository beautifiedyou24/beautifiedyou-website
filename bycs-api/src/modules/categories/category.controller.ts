import { Controller, Get, Post, Body, Param, Delete, Logger, HttpStatus, Put, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CategoryQueryDto } from "./dto/category-query.dto";
import { PaginatedCategoryResponseDto } from "./dto/paginated-category-response.dto";
import { UrlParameterPipe } from "src/pipes/url-parameter.pipe";
import { ResponseMessage } from "@decorators/response-message.decorator";
import { Public } from "@decorators/public.decorator";

@ApiTags("categories")
@ApiBearerAuth()
@Controller({
  path: "categories",
  version: "1",
})
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Public() //! temp
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CategoryResponseDto,
  })
  @ApiBody({
    type: CreateCategoryDto,
  })
  @ResponseMessage("Created", HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return await this.categoryService.createOneCategory(createCategoryDto);
  }

  @Public()
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedCategoryResponseDto,
  })
  async findAll(@Query() query: CategoryQueryDto): Promise<PaginatedCategoryResponseDto> {
    return await this.categoryService.findAllCategory(query);
  }

  @Public()
  @Get(":slug")
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseDto,
  })
  async findOne(@Param("slug") slug: string): Promise<CategoryResponseDto> {
    return this.categoryService.findOne({ filter: { slug } });
  }

  @Put(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryResponseDto,
  })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  async update(
    @Param("id", UrlParameterPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // return await this.categoryService.updateOneCategory(id, updateCategoryDto);
    return await this.categoryService.updateOne(id, updateCategoryDto);
  }

  @Delete(":id")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ResponseMessage("Category deleted successfully", HttpStatus.NO_CONTENT)
  async remove(@Param("id", UrlParameterPipe) id: string): Promise<boolean> {
    return await this.categoryService.deleteOne(id);
  }
}
