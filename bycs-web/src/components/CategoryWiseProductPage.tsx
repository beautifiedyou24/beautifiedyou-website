'use client';

import Loading from '@/app/loading';
import ProductFilters from '@/components/Products/elements/ProductFilters';
import ProductCard from '@/components/Products/ProductCard';
import AppLayout from '@/components/shared/AppLayout';
import useCategoryStore from '@/store/categoryStore';
import useProductStore from '@/store/productStore';

import { Empty, Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CategoryWiseProductPage = ({
	slug,
	categoryName,
}: {
	slug: string;
	categoryName: string;
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const { loading } = useProductStore();

	const pageSize = 8;
	const router = useRouter();

	const { fetchProducts, products, productMeta } = useProductStore();
	const { category } = useCategoryStore();

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleProductView = (slug: string) => {
		router.push(`/products/${slug}`);
	};

	useEffect(() => {
		fetchProducts(
			currentPage,
			undefined,
			undefined,
			undefined,
			[categoryName],
			undefined,
			undefined
		);
	}, [fetchProducts, currentPage, slug, category]);

	return (
		<AppLayout>
			<div className='bg-fuchsia-100'>
				{loading && <Loading />}

				{/* hero section */}
				<div className='relative w-full h-96 bg-fuchsia-100'>
					<div
						className='absolute inset-0 bg-cover bg-center'
						style={{ backgroundImage: `url(/images/shop-cover.jpg)` }}
					></div>
					<div className='absolute inset-0 bg-black opacity-50'></div>
					<div className='absolute inset-0 flex flex-col md:flex-row items-center justify-center p-8 md:pl-14 mt-10 md:mt-0'>
						<div className='text-white z-10 w-full md:w-1/2 text-center md:text-left'>
							<h1 className='text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase mb-2'>
								{category?.name}
							</h1>
							<p className='text-xs md:text-sm lg:text-base'>
								{category?.details}
							</p>
						</div>
						<div className='mt-4 md:mt-0 w-full md:w-1/3 flex items-center justify-center md:justify-end'>
							<div className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 overflow-hidden rounded-lg'>
								<img
									src={category?.image}
									alt={category?.name}
									className='w-full h-full object-cover'
								/>
							</div>
						</div>
					</div>
				</div>

				{products.length > 0 ? (
					<div>
						{/* filters and pagination */}
						<div className='container mx-auto px-8 py-8 pt-10 bg-fuchsia-100 font-light text-xs'>
							{/* Filters */}
							<div>
								<ProductFilters
									categoryFilterVisibilty={false}
									category={slug}
								/>
							</div>

							{/* products */}
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 lg:gap-4 gap-10 '>
								{products.map((product: any) => (
									<ProductCard
										key={product.id}
										product={product}
										handleProductView={() => handleProductView(product.slug)}
									/>
								))}
							</div>

							{/* pagination */}
							<div className='mt-8 flex justify-center items-center'>
								<Pagination
									current={currentPage}
									pageSize={pageSize}
									total={productMeta?.totalFilteredItemCount}
									onChange={handlePageChange}
									className='custom-pagination'
								/>
							</div>
						</div>
					</div>
				) : (
					<div className='flex flex-row justify-center items-center my-auto'>
						<Empty description='No products found' />
					</div>
				)}
			</div>
		</AppLayout>
	);
};

export default CategoryWiseProductPage;
