import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { BaseService } from "@common/base-service";
import { Injectable, NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { UpdateSoldCountDto } from "@products/dto/update-sold-count.dto";
import { ProductService } from "@products/product.service";
import { parseDate } from "src/utils/helper";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";
import { OrderResponseDto } from "./dto/order-response.dto";
import { OrderStatsQueryDto } from "./dto/order-stats-query.dto";
import { PaginatedOrderResponseDto } from "./dto/paginated-order-response.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { DeliveryStatus } from "./enums/delivery-status.enum";
import { SHIPPING_METHODS } from "./enums/order.enum";
import { IOrderService } from "./interfaces/order-service.interface";
import { Order } from "./models/order.model";
import { OrderRepository } from "./order.repository";

@Injectable()
export class OrderService
  extends BaseService<Order, CreateOrderDto, UpdateOrderDto, OrderResponseDto>
  implements IOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly productService: ProductService,
  ) {
    super(orderRepository, mapper, {
      modelClass: Order,
      createDtoClass: CreateOrderDto,
      updateDtoClass: UpdateOrderDto,
      responseDtoClass: OrderResponseDto,
    });
  }

  getMonthlyDeliveryStats = (orders: any) => {
    const monthlyData = Array(12)
      .fill(0)
      .map(() => ({
        Processing: 0,
        Dispatched: 0,
        Delivered: 0,
        Cancelled: 0,
      }));

    orders.forEach((order) => {
      const month = new Date(order.date).getMonth();

      const processingCount = orders.filter(
        (order) => order.deliveryStatus === DeliveryStatus.Processing && new Date(order.date).getMonth() === month,
      ).length;
      const dispatchCount = orders.filter(
        (order) => order.deliveryStatus === DeliveryStatus.Dispatched && new Date(order.date).getMonth() === month,
      ).length;
      const deliveredCount = orders.filter(
        (order) => order.deliveryStatus === DeliveryStatus.Delivered && new Date(order.date).getMonth() === month,
      ).length;
      const cancelledCount = orders.filter(
        (order) => order.deliveryStatus === DeliveryStatus.Cancelled && new Date(order.date).getMonth() === month,
      ).length;

      monthlyData[month].Processing = processingCount;
      monthlyData[month].Dispatched = dispatchCount;
      monthlyData[month].Delivered = deliveredCount;
      monthlyData[month].Cancelled = cancelledCount;
    });

    const monthlyDeliveryStats = monthlyData.map((data, index) => ({
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      ...data,
    }));

    return monthlyDeliveryStats;
  };

  getMonthlySalesStats = (orders: any) => {
    const monthlyData = Array(12)
      .fill(0)
      .map(() => ({
        sales: 0,
      }));

    orders.forEach((order) => {
      const month = new Date(order.date).getMonth();

      const processingCount = orders.filter(
        (order) => order.deliveryStatus === DeliveryStatus.Delivered && new Date(order.date).getMonth() === month,
      );
      monthlyData[month].sales = processingCount.reduce((total, order) => {
        return total + order.totalPrice;
      }, 0);
    });

    const monthlySalesStats = monthlyData.map((data, index) => ({
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      ...data,
    }));

    return monthlySalesStats;
  };

  getDivisionWiseSalesStats = (orders) => {

    const sales = orders.reduce((acc, order) => {
      const division = order.deliveryAddress.division;

      // Count for divisions
      acc.divisionWiseSalesStats[division] = (acc.divisionWiseSalesStats[division] || 0) + 1;

      return acc;
    }, { divisionWiseSalesStats: {} });

    const totalSales = Object.values(sales.divisionWiseSalesStats).reduce(
      (sum: number, count: number) => sum + count,
      0
    );

    const total: number = totalSales as number;

    const salesByDivisionData = Object.keys(sales.divisionWiseSalesStats)
      .map((division) => ({
        division,
        Sales: parseFloat(String((sales.divisionWiseSalesStats[division] / total).toFixed(2))) * 100
      }))
      .slice(0, 5);


    return salesByDivisionData;
  };

  async createOneOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    //! verify phone number before confirming order?

    // add optional userId
    const { items, ...otherProperties } = createOrderDto;

    const productIds = items.map((item) => item.productId);
    const products = await this.productService.findAllProductByIds(productIds);

    const getPriceAndStock = (productId: string, color: string): { pricePerItem: number; stockCount: number; imageObj: any[] } => {
      for (const product of products) {
        if (product.id == productId) {
          const imageObj = product.meta.imageObj.find((obj) => Object.keys(obj)[0].toLowerCase() === color.toLowerCase());

          if (!imageObj) {
            throw new NotFoundException(`color ${color} not found for product ${productId}`);
          }

          const [, , stockCount] = Object.values(imageObj)[0] as [string, string, number];

          return {
            pricePerItem: product.finalPrice,
            stockCount,
            imageObj: product.meta.imageObj,
          };
        }
      }
      throw new NotFoundException(`product with id ${productId} not found`);
    };

    let totalPrice = 0;

    const updatedStockCounts: { id: string; imageObj: any[] }[] = products.map((product) => ({
      id: product.id,
      imageObj: product.meta.imageObj,
    }));

    // calculate price and updated stock
    const orderItems = items.map((item) => {
      const { pricePerItem, stockCount, imageObj } = getPriceAndStock(item.productId, item.color);

      if (item.quantity > stockCount) {
        const product = products.find((product) => product.id == item.productId);
        throw new PreconditionFailedException(`${product.name} (${item.color}) is out of stock`);
      }

      imageObj.map((obj) => {
        const [color, values] = Object.entries(obj)[0];
        const [url, hex, stock] = values as [string, string, number];
        let updatedStock = stock;

        if (item.color === color) {
          updatedStock = stock - item.quantity;

          if (updatedStock < 0) {
            throw new PreconditionFailedException(`Insufficient stock for color ${color}`);
          }

          const existingProductIndex = updatedStockCounts.findIndex((product) => product.id === item.productId);

          if (existingProductIndex !== -1) {
            updatedStockCounts[existingProductIndex].imageObj = updatedStockCounts[existingProductIndex].imageObj.map((obj) => {
              const [objColor, objValues] = Object.entries(obj)[0];
              const [objUrl, objHex, objStock] = objValues as [string, string, number];

              if (objColor === color) {
                return { [objColor]: [objUrl, objHex, updatedStock] };
              }

              return obj;
            });
          }
        }

        return { [color]: [url, hex, updatedStock] };
      });

      totalPrice += pricePerItem * item.quantity;
      return { quantity: item.quantity, product: item.productId, pricePerItem, color: item.color, image: item.image };
    });

    // add shipping cost
    const shippingMethod = createOrderDto.shippingMethod;
    const shippingCost =
      shippingMethod == SHIPPING_METHODS.INSIDE_DHAKA
        ? parseInt(process.env.INSIDE_DHAKA_SHIPPING_CHARGE)
        : parseInt(process.env.OUTSIDE_DHAKA_SHIPPING_CHARGE);
    const totalPriceWithShipping = totalPrice + shippingCost;

    // order number
    const highestOrderNumber = await this.orderRepository.findHighestOrderNumber();
    const orderData = {
      items: orderItems,
      totalPrice: totalPriceWithShipping,
      ...otherProperties,
      orderNumber: highestOrderNumber + 1,
    };

    // save order
    const createdOrder = await this.orderRepository.saveOne(orderData);

    // update stockCount for products
    await this.productService.updateStockCounts(updatedStockCounts);

    const orderResponse = await this.findOneOrderById(createdOrder.id);
    return orderResponse;
  }


  async updateOneOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const updatedOrder = this.updateOne(id, updateOrderDto);
    const updatedSoldCounts: UpdateSoldCountDto[] = [];

    if (updateOrderDto.deliveryStatus === DeliveryStatus.Delivered) {
      const order = await this.findOneById(id);

      for (const item of order.items) {
        updatedSoldCounts.push({ id: String(item.product), soldCount: item.quantity });
      }

      await this.productService.updateSoldCounts(updatedSoldCounts);
    }

    return updatedOrder;
  }

  async findOneOrderById(id: string): Promise<OrderResponseDto> {
    const data = await this.orderRepository.findOneOrderByIdWithProducts(id);

    if (!data) throw new NotFoundException("order not found");

    const order = this.mapper.map<Order, OrderResponseDto>(data, Order, OrderResponseDto);
    return order;
  }

  async findAllOrder(query: OrderQueryDto): Promise<PaginatedOrderResponseDto> {
    const { page, limit, sortBy, sortOrder, searchTerm, deliveryStatus, from, to } = query;
    let startDate;
    let endDate;
    const filter: any = {};

    if (from && to) {
      startDate = parseDate(from);
      endDate = parseDate(to);

      endDate.setDate(endDate.getDate() + 1);

      filter.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (searchTerm) {
      filter.$or = [
        { customerName: new RegExp(searchTerm, "i") },
        { phone_1: new RegExp(searchTerm, "i") },
        // { orderNumber: parseInt(searchTerm) },
        { "deliveryAddress.country": new RegExp(searchTerm, "i") },
        { "deliveryAddress.division": new RegExp(searchTerm, "i") },
        { "deliveryAddress.subdivision": new RegExp(searchTerm, "i") },
        { "deliveryAddress.details": new RegExp(searchTerm, "i") },
      ];
    }

    if (deliveryStatus) {
      filter.deliveryStatus = deliveryStatus;
    }

    return this.paginate({
      page,
      limit,
      sortBy,
      sortOrder,
      relations: {
        path: "items",
        populate: {
          path: "product",
          model: "Product",
        },
      },
      filter: {
        ...filter,
      },
    });
  }

  async findOrderStats(query: OrderStatsQueryDto): Promise<{ [key: string]: any }> {
    const { searchTerm, from, to } = query;

    // filters
    const filter: any = {};
    let startDate;
    let endDate;
    const deliveryStatusCount: { [key: string]: number } = {};
    const deliveryStatusArray = [
      DeliveryStatus.Processing,
      DeliveryStatus.Dispatched,
      DeliveryStatus.Delivered,
      DeliveryStatus.Cancelled,
    ];

    if (searchTerm) {
      filter.$or = [
        { customerName: new RegExp(searchTerm, "i") },
        { phone_1: new RegExp(searchTerm, "i") },
        { "deliveryAddress.country": new RegExp(searchTerm, "i") },
        { "deliveryAddress.division": new RegExp(searchTerm, "i") },
        { "deliveryAddress.subdivision": new RegExp(searchTerm, "i") },
        { "deliveryAddress.details": new RegExp(searchTerm, "i") },
      ];
    }

    if (from && to) {
      startDate = parseDate(from);
      endDate = parseDate(to);

      endDate.setDate(endDate.getDate() + 1);

      filter.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // fetch all orders
    const orders = await this.orderRepository.findOrders(filter);

    // count delivery status
    deliveryStatusArray.map((status) => {
      const statusCount = orders.filter((order) => order.deliveryStatus === status).length;
      deliveryStatusCount[status] = statusCount;
    });

    // calculate total sales
    const totalSales = orders
      .filter((order) => order.deliveryStatus === DeliveryStatus.Delivered)
      .reduce((total, order) => {
        return total + order.totalPrice;
      }, 0);

    // calculate monthly delivery stats
    const monthlyDeliveryStats = this.getMonthlyDeliveryStats(orders);

    // calculate monthly sales stats
    const monthlySalesStats = this.getMonthlySalesStats(orders);

    // calculate division wise sales stats
    const divisionWiseSalesStats = this.getDivisionWiseSalesStats(orders);

    const response = {
      totalSales,
      totalOrders: orders.length,
      monthlyDeliveryStats: monthlyDeliveryStats,
      monthlySalesStats: monthlySalesStats,
      divisionWiseSalesStats: divisionWiseSalesStats,
      ...deliveryStatusCount,
    };

    return response;
  }
}
