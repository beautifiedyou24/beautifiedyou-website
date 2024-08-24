'use client'

import { ProductType } from '@/components/Products/types/product.type';
import { Pagination } from '@/models/paginate.model';
import { ProductStatsType } from '@/models/product.model';
import axiosInstance from '@/utils/axiosConfig';
import { message } from 'antd';
import { create } from 'zustand';
import { createSelectors } from './create-selectors';

interface ProductStore {
    products: ProductType[];
    product: ProductType;
    productMeta?: Pagination;
    selectedProduct: ProductType | null;
    productStats: ProductStatsType | null;
    fetchProducts: (pageNumber?: number, searchTerm?: string, maxPrice?: number, minPrice?: number, categories?: string[], sortBy?: string, sortOrder?: string, limit?: number) => Promise<ProductType[]>;
    fetchProductStats: (searchTerm?: string, maxPrice?: number, minPrice?: number, categories?: string[]) => Promise<ProductStatsType>;
    fetchSingleProduct: (id: string) => Promise<void>;
    addProduct: (product: ProductType) => void;
    updateProduct: (product: ProductType) => void;
    setSelectedProduct: (product: ProductType) => void;
    clearSelectedProduct: () => void;
    removeProduct: (productId: string) => void;
    loading: boolean;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    loading: false,
    productStats: null,
    product: {
        id: '',
        name: '',
        price: 0,
        finalPrice: 0,
        stockCount: 0,
        color: '',
        soldCount: 0,
        details: '',
        categories: [],
        images: [],
        slug: ''
    },
    selectedProduct: null,
    fetchProducts: async (pageNumber?: number, searchTerm = '', minPrice = 1, maxPrice = 1000000, categories = [], sortBy = 'name', sortOrder = 'asc', limit?: number): Promise<ProductType[]> => {
        set({ loading: true });
        try {
            const pageParam = pageNumber ? `page=${pageNumber}` : '';
            const pageLimit = limit ? `&limit=${limit}` : '&limit=8';
            const response = await axiosInstance.get(`/v1/products?${pageParam}${pageLimit}&sortBy=${sortBy}&sortOrder=${sortOrder}&searchTerm=${searchTerm}&minPrice=${minPrice}&maxPrice=${maxPrice}&categories=${categories.length > 0 ? JSON.stringify(categories) : ''}`);
            set({ products: response.data.data.items, productMeta: response.data.data.meta, loading: false });
            return response.data.data.items;
        } catch (error) {
            message.error('Failed to load products');
            set({ loading: false });
            return [];
        }
    },

    fetchProductStats: async (searchTerm?: string, maxPrice?: number, minPrice?: number, categories = []): Promise<ProductStatsType> => {
        set({ loading: true });
        try {
            const searchTermParam = searchTerm ? `searchTerm=${searchTerm}` : '';
            const minPriceParam = minPrice ? `&minPrice=${minPrice}` : '';
            const response = await axiosInstance.get(`/v1/products/stats?${searchTermParam}${minPriceParam}`);
            set({ productStats: response.data.data, loading: false });
            return response.data.data;
        } catch (error) {
            message.error('Failed to load products');
            set({ loading: false });
            return {};
        }
    },


    fetchSingleProduct: async (productId: string) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.get(`/v1/products/${productId}`);
            set({ product: response.data.data.data, loading: false });
        } catch (error) {
            message.error('Failed to load products');
            set({ loading: false });
        }
    },
    addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
    updateProduct: (updatedProduct: ProductType) => {
        set({ loading: true });
        set((state) => ({
            products: state.products.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            ),
            loading: false
        }));
    },
    removeProduct: (productId: string) => {
        set({ loading: true });
        set((state) => ({
            products: state.products.filter((product) => product.id !== productId), loading: false
        }));
    },
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    clearSelectedProduct: () => set({ selectedProduct: null }),
}));

export const useProductStoreSelector = createSelectors(useProductStore);
export default useProductStore;
