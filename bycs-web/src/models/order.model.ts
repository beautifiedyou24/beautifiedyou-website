import { Address } from "./address.model"
import { Pagination } from "./paginate.model"
import { Product } from "./product.model"

export interface OrderList {
    meta: Pagination,
    items: Order[]
}

export interface Order {
    id: string
    orderNumber: number
    totalPrice: number,
    deliveryAddress: Address,
    deliveryStatus: string,
    customerName: string,
    shippingMethod: string,
    paymentMethod: string,
    email: string,
    phone_1: string,
    phone_2: string,
    date: string;
    items: Product[]
}

