'use client'

import { OrderPayloadType, OrderResponseType, OrderStats, OrderType } from "@/components/Orders/types/order.type";
import { Pagination } from "@/models/paginate.model";
import axiosInstance from "@/utils/axiosConfig";
import { create } from "zustand";

interface OrderStore {
    orders: OrderType[];
    orderMeta?: Pagination;
    selectedOrder: OrderType | null;
    loading: boolean,
    orderStats: OrderStats | null;
    fetchOrderStats: (from?: string, to?: string, searchTerm?: string) => Promise<void>;
    fetchOrders: (pageNumber?: number, searchTerm?: string, from?: string, to?: string, deliveryStatus?: string, limit?: number) => Promise<void>;
    fetchSingleOrder: (id: string) => Promise<void>;
    createOrder: (order: OrderPayloadType) => Promise<OrderResponseType>;
    updateOrder: (id: string, updatedOrder: Partial<OrderType>, newData: OrderType) => Promise<void>;
    setSelectedOrder: (order: OrderType) => void;
    clearSelectedOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    orderMeta: undefined,
    loading: false,
    selectedOrder: null,
    orderStats: null,

    fetchOrders: async (pageNumber = 1, searchTerm?: string, from?: string, to?: string, deliveryStatus?: string, limit?: number) => {
        set({ loading: true });
        const deliveryParam = deliveryStatus ? `&deliveryStatus=${deliveryStatus}` : '';
        const limitParam = limit ? `&limit=${limit}` : '';
        const pageParam = pageNumber ? `page=${pageNumber}` : '';
        try {
            const url = `/v1/orders?${pageParam}${limitParam}&${searchTerm ? `&searchTerm=${searchTerm}` : ''}&from=${from ?? ''}&to=${to ?? ''}${deliveryParam}`;
            const response = await axiosInstance.get(url);
            const data: OrderResponseType = response.data.data;
            set({ orders: data.items, orderMeta: data.meta });
            set({ loading: false });
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    },

    fetchOrderStats: async (from?: string, to?: string, searchTerm?: string) => {
        set({ loading: true });

        const fromDateParam = from ? `from=${from}` : '';
        const toDateParam = to ? `&to=${to}` : '';
        const searchTermParam = searchTerm ? `&searchTerm=${searchTerm}` : '';
        try {
            const response = await axiosInstance.get(`/v1/orders/stats?${fromDateParam}${toDateParam}${searchTermParam}`);
            set({ orderStats: response.data.data });
            set({ loading: false });

        } catch (error) {
            console.error('Failed to fetch order status counts', error);
        }
    },

    fetchSingleOrder: async (id: string) => {
        try {
            const response = await axiosInstance.get(`/v1/orders/${id}`);
            const order: OrderType = response.data.data;
            set({ selectedOrder: order });
        } catch (error) {
            console.error("Failed to fetch single order:", error);
        }
    },

    createOrder: async (payload: OrderPayloadType) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post('v1/orders', payload);
            set((state) => ({ orders: [...state.orders, response?.data.data] }));
            set({ loading: false });
            return Promise.resolve(response?.data.data);
        } catch (error) {
            console.error("Failed to create order:", error);
            return Promise.reject(error);
        }
    },

    updateOrder: async (id: string, updatedOrder: Partial<OrderType>, newData: OrderType) => {

        try {
            const response = await axiosInstance.put(`/v1/orders/${id}`, updatedOrder);
            const updated: OrderType = response.data.data;

            set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === id ? newData : order
                ),
                selectedOrder: state.selectedOrder?.id === id ? newData : state.selectedOrder,
            }));
        } catch (error) {
            console.error("Failed to update order:", error);
        }
    },


    setSelectedOrder: (order: OrderType) => set({ selectedOrder: order }),
    clearSelectedOrder: () => set({ selectedOrder: null }),
}));
