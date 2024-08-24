import { DiscountType } from "@/components/Products/types/product.type";

export interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    color: string;
    finalPrice: number;
    stockCount: number;
    soldCount: number;
    categories: string[];
    details: string;
    discount?: DiscountType
    images: string[];
}

export interface FeaturedProductsProps {
    products: Product[];
}

export interface ProductStatsType {
    [key: string]: any;
}