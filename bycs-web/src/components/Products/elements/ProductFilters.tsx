import useCategoryStore from '@/store/categoryStore';
import { useFilterStore } from '@/store/filterStore'; // Adjust the import path as needed
import useProductStore from '@/store/productStore';
import { Checkbox, Input, Select, Slider, Tag } from 'antd';
import { debounce } from 'lodash';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCallback, useState } from 'react';

const ProductFilters = ({
	categoryFilterVisibilty,
	category,
	newSortOptions,
}: {
	categoryFilterVisibilty: boolean;
	category?: string;
	newSortOptions?: any;
}) => {
	const [showPriceFilter, setShowPriceFilter] = useState(false);
	const [showCategoryFilter, setShowCategoryFilter] = useState(false);
	const {
		filterParams,
		setPriceRange,
		setFilterCategories,
		setSortOption,
		setCurrentPage,
	} = useFilterStore();
	const { priceRange, filterCategories } = filterParams;

	// fetch and get data
	const { fetchProducts, productMeta } = useProductStore();
	const categories = useCategoryStore((state) => state.categories);

	const debouncedFetchProducts = useCallback(
		debounce((minPrice?, maxPrice?, categories?, sortBy?, sortOrder?) => {
			fetchProducts(
				1,
				undefined,
				minPrice,
				maxPrice,
				categories,
				sortBy,
				sortOrder,
				8
			);
			setShowCategoryFilter(false);
			setShowPriceFilter(false);
		}, 500),
		[fetchProducts]
	);

	const sortOptions = [
		{ label: 'Price: Low to High', value: 'price_asc' },
		{ label: 'Price: High to Low', value: 'price_desc' },
		{ label: 'Name: A to Z', value: 'name_asc' },
		{ label: 'Name: Z to A', value: 'name_desc' },
		{ label: 'Date: Old to New', value: 'date_asc' },
		{ label: 'Date: New to Old', value: 'date_desc' },
	];

	return (
		<div className='mb-3 flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center gap-4'>
			{/* filters */}
			<div>
				<div className='flex flex-1 items-center gap-2'>
					<div>Filters: </div>

					{/* price filter */}
					<div className='relative'>
						<button
							className='flex flex-1 justify-center items-center gap-1 px-2 font-medium'
							onClick={() => {
								setShowPriceFilter(!showPriceFilter);
								if (showCategoryFilter) setShowCategoryFilter(false);
							}}
						>
							Price{' '}
							{!showPriceFilter ? (
								<ChevronDown size={18} />
							) : (
								<ChevronUp size={18} />
							)}
						</button>

						{showPriceFilter && (
							<div className='absolute top-full left-0 mt-2 bg-white border-2 border-coreBrown shadow-2xl shadow-coreLightPink rounded-lg p-4 z-10 w-56'>
								<Slider
									range
									min={0}
									max={10000}
									value={priceRange}
									onChange={(value) => {
										setPriceRange(value as [number, number]);

										debouncedFetchProducts(value[0], value[1]);
									}}
								/>
								<div className='flex justify-between mt-2'>
									<Input
										type='number'
										value={priceRange[0]}
										onChange={(e) => {
											const newMinPrice = Number(e.target.value);
											setPriceRange([newMinPrice, priceRange[1]]);
											debouncedFetchProducts(
												newMinPrice,
												priceRange[1],
												categories.map((item) => item.name)
											);
										}}
										style={{ width: '45%' }}
									/>
									<Input
										type='number'
										value={priceRange[1]}
										onChange={(e) => {
											const newMaxPrice = Number(e.target.value);
											setPriceRange([priceRange[0], newMaxPrice]);
											debouncedFetchProducts(
												priceRange[0],
												newMaxPrice,
												categories.map((item) => item.name)
											);
										}}
										style={{ width: '45%' }}
									/>
								</div>
								<button
									className='mt-2 w-full bg-coreBrown text-white hover:bg-coreLightPink hover:text-coreDarkBrown py-1 rounded'
									onClick={() => {
										setPriceRange([0, 10000]);
										setShowPriceFilter(!showPriceFilter);
										debouncedFetchProducts(0, 10000, ['']);
									}}
								>
									Reset
								</button>
							</div>
						)}
					</div>

					{/* category filter */}
					{categoryFilterVisibilty && (
						<div className='relative'>
							<button
								className='flex flex-1 justify-center items-center gap-1 font-medium'
								onClick={() => {
									setShowCategoryFilter(!showCategoryFilter);
									if (showPriceFilter) setShowPriceFilter(false);
								}}
							>
								Category{' '}
								{!showCategoryFilter ? (
									<ChevronDown size={18} />
								) : (
									<ChevronUp size={18} />
								)}
							</button>

							{showCategoryFilter && (
								<div className='absolute top-full left-0 mt-2 bg-white border-2 border-coreBrown shadow-2xl shadow-coreLightPink rounded-lg p-4 z-10 w-40'>
									<Checkbox.Group
										options={categories.map((category) => ({
											label: category.name,
											value: category.name,
										}))}
										value={filterCategories}
										onChange={(checkedValues) => {
											setFilterCategories(checkedValues);
											debouncedFetchProducts(
												priceRange[0],
												priceRange[1],
												checkedValues
											);
										}}
									/>
								</div>
							)}
						</div>
					)}
				</div>

				{/* show filter tags */}
				<div className='mt-2'>
					{priceRange[0] !== 0 || priceRange[1] !== 10000 ? (
						<Tag
							closable
							onClose={() => {
								setPriceRange([0, 10000]);
								debouncedFetchProducts(0, 10000, ['']);
							}}
							className='bg-coreLightPink text-coreDarkBrown'
						>
							Tk {priceRange[0]}-{priceRange[1]}
						</Tag>
					) : null}
					{filterCategories.map((categoryId) => {
						const category = categories.find((c) => c.id === categoryId);
						return (
							<Tag
								key={categoryId}
								closable
								onClose={() => {
									const updatedCategory = filterCategories.filter(
										(id) => id !== categoryId
									);
									setFilterCategories(updatedCategory);
									debouncedFetchProducts(
										priceRange[0],
										priceRange[1],
										updatedCategory
									);
								}}
								className='bg-coreLightPink text-coreDarkBrown'
							>
								{category ? category.name : categoryId}
							</Tag>
						);
					})}
				</div>
			</div>

			{/* sorting */}
			<div className='flex flex-row justify-center items-center gap-5'>
				<div className='flex flex-row gap-1 justify-center items-center '>
					<h1>Sort By: </h1>
					<h1 className='font-medium text-sx'>
						{/* select box */}
						<Select
							defaultValue='Name: A to Z'
							style={{ width: 180 }}
							onChange={(value) => {
								setSortOption(value);
								setCurrentPage(1);
								const splitValue = value.split('_');
								const sortBy = splitValue[0];
								const sortOrder = splitValue[1];
								const currentCategories = categoryFilterVisibilty
									? filterCategories
									: [category];

								debouncedFetchProducts(
									priceRange[0],
									priceRange[1],
									currentCategories,
									sortBy,
									sortOrder
								);
							}}
							showSearch
							options={
								newSortOptions
									? [...newSortOptions, ...sortOptions]
									: sortOptions
							}
						/>
					</h1>
				</div>
				<div className='font-light'>
					{productMeta?.totalFilteredItemCount !==
					productMeta?.totalItemCount ? (
						<div>
							{productMeta?.totalFilteredItemCount} of{' '}
							{productMeta?.totalItemCount} products
						</div>
					) : (
						<div>{productMeta?.totalItemCount} products</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductFilters;
