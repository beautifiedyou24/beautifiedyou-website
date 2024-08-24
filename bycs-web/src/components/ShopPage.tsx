'use client';

import ProductFilters from '@/components/Products/elements/ProductFilters';
import ProductCard from '@/components/Products/ProductCard';
import CustomHero from '@/components/shared/CustomHero';
import useCategoryStore from '@/store/categoryStore';
import useFilterStore from '@/store/filterStore';
import useProductStore from '@/store/productStore';

import { Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ShopPage: React.FC = () => {
	const { filterParams } = useFilterStore();
	const { priceRange, filterCategories, sortOption, pageLimit, currentPage } =
		filterParams;
	const { setCurrentPage } = useFilterStore();

	const router = useRouter();

	// fetch and get data
	const fetchProducts = useProductStore((state) => state.fetchProducts);
	const fetchCategories = useCategoryStore((state) => state.fetchCategories);

	const products = useProductStore((state) => state.products);
	const productMeta = useProductStore((state) => state.productMeta);

	const handlePageChange = (page: number) => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setCurrentPage(page);
	};

	const handleProductView = (slug: string) => {
		router.push(`/products/${slug}`);
	};

	useEffect(() => {
		let sortBy;
		let sortOrder;
		if (sortOption) {
			const splitValue = sortOption?.split('_');
			sortBy = splitValue[0];
			sortOrder = splitValue[1];
		} else {
			sortBy = 'name';
			sortOrder = 'asc';
		}

		fetchProducts(
			currentPage,
			'',
			priceRange[0],
			priceRange[1],
			filterCategories,
			sortBy,
			sortOrder,
			pageLimit
		);
	}, [fetchProducts, currentPage]);

	useEffect(() => {
		fetchCategories(1);
	}, [fetchCategories]);

	return (
		<div className='bg-fuchsia-100'>
			<div className='relative h-64 mb-8'>
				<CustomHero img={'/images/shop-cover.jpg'} title={'SHOP'} />
			</div>

			<div className='container mx-auto px-8 py-8 pt-10 font-light text-xs'>
				{/* Filters */}
				<ProductFilters categoryFilterVisibilty={true} />

				{/* products */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 lg:gap-4 gap-10 '>
					{products.map((product) => (
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
						pageSize={pageLimit}
						total={productMeta?.totalFilteredItemCount}
						onChange={handlePageChange}
						className='custom-pagination'
					/>
				</div>
			</div>
		</div>
	);
};

export default ShopPage;
