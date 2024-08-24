import { Public } from "@decorators/public.decorator";
import { ResponseMessage } from "@decorators/response-message.decorator";
import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UrlParameterPipe } from "src/pipes/url-parameter.pipe";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";
import { OrderResponseDto } from "./dto/order-response.dto";
import { OrderStatsQueryDto } from "./dto/order-stats-query.dto";
import { PaginatedOrderResponseDto } from "./dto/paginated-order-response.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderService } from "./order.service";

@ApiTags("orders")
@ApiBearerAuth()
@Controller({
  path: "orders",
  version: "1",
})
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) { }

  @Public()
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OrderResponseDto,
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ResponseMessage("Created", HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return await this.orderService.createOneOrder(createOrderDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedOrderResponseDto,
  })
  async findAll(@Query() query: OrderQueryDto): Promise<PaginatedOrderResponseDto> {
    return this.orderService.findAllOrder(query);
  }

  @Public()
  @Get("/stats")
  @ApiResponse({
    status: HttpStatus.OK,
    type: Object, // Adjust the type to match your response DTO if you have one
  })
  @ResponseMessage("Order status counts fetched successfully", HttpStatus.OK)
  async findOrderStats(@Query() query: OrderStatsQueryDto): Promise<{ [key: string]: any }> {
    return this.orderService.findOrderStats(query);
  }

  @Get(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  async findOne(@Param("id", UrlParameterPipe) id: string): Promise<OrderResponseDto> {
    return this.orderService.findOneOrderById(id);
  }

  @Put(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  async update(
    @Param("id", UrlParameterPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOneOrder(id, updateOrderDto);
  }

  @Delete(":id")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ResponseMessage("Order deleted successfully", HttpStatus.NO_CONTENT)
  async remove(@Param("id", UrlParameterPipe) id: string): Promise<boolean> {
    return await this.orderService.deleteOne(id);
  }
}
