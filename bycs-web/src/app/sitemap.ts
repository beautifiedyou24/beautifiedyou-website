import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products?limit=100000`
    );

    const data = await response.json();
    const products = data?.data?.items || [];

    const productEntries = products.map((product: { slug: string }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}`
    }))

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop`,
            lastModified: new Date()
        },
        ...productEntries
    ]
}