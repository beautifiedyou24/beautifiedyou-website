import ProductDetailsPage from '@/components/ProductDetailsPage';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: any }) {
	const productResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products/${params.slug}`
	);
	const productData = await productResponse.json();
	const product = productData?.data;

	// If product is not found, return a 404 title
	if (!product) {
		return {
			title: '404 Not Found',
		};
	}

	// Otherwise, set the title using the product name or the slug
	const productName =
		product.name ||
		params.slug
			.split('-')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

	return {
		title: `${productName}`,
	};
}

export async function generateStaticParams() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products?limit=100000`
	);

	const data = await response.json();

	const items = data?.data?.items || [];

	return items.map((product: { slug: string }) => ({
		slug: product.slug,
	}));
}

export default async function ProductDetails({ params }: { params: any }) {
	const productResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products/${params.slug}`
	);

	const productData = await productResponse.json();
	const product = productData?.data;
	const category = productData?.data?.categories[0];

	if (product == null) {
		notFound();
	}

	const mostSoldProductResponse = await fetch(
		`${
			process.env.NEXT_PUBLIC_API_BASE_URL
		}/v1/products?categories=${JSON.stringify([
			category,
		])}&limit=5&sortBy=soldCount&sortOrder=desc`
	);

	const mostSoldProductData = await mostSoldProductResponse.json();
	const mostSoldProducts = mostSoldProductData.data.items.filter(
		(prod: any) => prod.slug !== params.slug
	);

	return (
		<div>
			<ProductDetailsPage
				fetchedProduct={product}
				fetchedMostSoldProducts={mostSoldProducts}
			/>
		</div>
	);
}
