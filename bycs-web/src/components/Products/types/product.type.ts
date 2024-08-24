
export interface ProductType {
    id: string
    name: string
    slug: string
    price: number
    finalPrice: number
    stockCount: number
    soldCount: number
    color: string
    details: string
    categories: string[]
    images: string[]
    discount?: DiscountType
    meta?: {
        [key: string]: [string, string, number];
    }
}

export interface DiscountType {
    percentage: string
    startAt: string
    endAt: string
    details: string
}