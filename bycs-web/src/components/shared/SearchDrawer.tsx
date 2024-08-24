// components/Search/SearchDrawer.tsx
import useProductStore from '@/store/productStore';
import { SearchOutlined } from '@ant-design/icons';
import { Drawer, Input } from 'antd';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { ProductType } from '../Products/types/product.type';

interface SearchDrawerProps {
	visible: boolean;
	onClose: () => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ visible, onClose }) => {
	const [searchResults, setSearchResults] = useState<ProductType[]>([]);
	const { fetchProducts, products, loading } = useProductStore();

	const router = useRouter();

	const debouncedSearch = useCallback(
		debounce(async (searchTerm: string) => {
			const data = await fetchProducts(undefined, searchTerm);
			setSearchResults(data);
		}, 300),
		[fetchProducts, products]
	);

	return (
		<Drawer placement='top' height='100%' onClose={onClose} open={visible}>
			<div className='flex flex-col justify-center items-center'>
				<Input.Search
					size='large'
					placeholder='Search Products...'
					prefix={<SearchOutlined />}
					onChange={(event) => debouncedSearch(event.target.value)}
					className='w-full max-w-2xl mb-8'
					allowClear
					loading={loading}
				/>
			</div>
			<div className='px-4 sm:px-8 md:px-16 lg:px-24 max-w-3xl mx-auto'>
				<div className='space-y-4'>
					{searchResults.map((product) => (
						<div
							key={product.id}
							className='flex items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden cursor-pointer'
							onClick={() => {
								router.push(`/products/${product.slug}`);
								onClose();
							}}
						>
							<div className='w-24 h-24 sm:w-32 sm:h-32 relative flex-shrink-0'>
								<Image
									src={product.images[0] || '/images/default-product.png'}
									alt={product.name}
									layout='fill'
									objectFit='cover'
									className='object-contain'
								/>
							</div>
							<div className='p-4 flex-grow'>
								<h3 className='text-lg font-semibold text-coreDarkBrown'>
									{product.name}
								</h3>
								<p className='text-sm text-coreBrown mt-1'>
									{product.categories[0]}
								</p>
								<p className='text-md font-bold mt-2 text-coreDarkBrown'>
									Tk {product.price} BDT
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</Drawer>
	);
};

export default SearchDrawer;
