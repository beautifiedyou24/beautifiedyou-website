import { Address } from "@/models/address.model";
import { Pagination } from "@/models/paginate.model";

export interface OrderType {
    id: string
    orderNumber: number
    totalPrice: number,
    deliveryAddress: Address,
    deliveryStatus: string,
    customerName: string,
    paymentMethod: string,
    shippingMethod: string,
    email: string,
    phone_1: string,
    phone_2: string,
    date: string,
    meta: Pagination,
    items: any
}

export interface OrderResponseType {
    orderNumber: number,
    totalPrice: number,
    deliveryAddress: Address,
    deliveryStatus: string,
    paymentMethod: string,
    shippingMethod: string,
    customerName: string,
    email: string,
    phone_1: string,
    phone_2: string,
    date: string,
    items: any,
    meta: Pagination
}

export interface OrderPayloadType {
    items: {
        productId: string,
        quantity: number,
        color: string,
    }[],
    deliveryAddress: Address,
    customerName: string,
    shippingMethod: string,
    email: string,
    phone_1: string,
    phone_2: string,
    paymentMethod: string,
    date: string,
}

export interface OrderStats {
    Processing: number;
    Dispatched: number;
    Delivered: number;
    Cancelled: number;
    totalSales: number;
    totalOrders: number;
    monthlyDeliveryStats: any[];
    monthlySalesStats: any[];
    divisionWiseSalesStats: any[];
}