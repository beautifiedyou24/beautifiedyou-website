'use client';

import AddProduct from '@/components/Products/AddProduct';
import ProductFilters from '@/components/Products/elements/ProductFilters';
import ProductTable from '@/components/Products/ProductTable';
import FileImport from '@/components/shared/FileImport';
import SearchBar from '@/components/shared/SearchBar';
import useProductStore from '@/store/productStore';
import axiosInstance from '@/utils/axiosConfig';

import { Breadcrumb, Button, message } from 'antd';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

const ProductPage = () => {
	const [loading, setLoading] = useState(false);
	const [showAddProductDrawer, setShowAddProductDrawer] =
		useState<boolean>(false);

	const { fetchProducts, productMeta } = useProductStore();

	const handleProductSearch = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const searchTerm = event.target.value;
		setLoading(true);
		await fetchProducts(undefined, searchTerm);
		setLoading(false);
	};

	const handleImportProducts = async (file: File) => {
		if (!file) {
			return;
		}

		Papa.parse(file, {
			complete: async (results) => {
				const jsonData = results.data.map((item: any) => ({
					...item,
					price: parseInt(item?.price, 10),
					stockCount: parseInt(item?.stockCount, 10),
					categories: item?.categories.split(', ').map((c: string) => c.trim()),
				}));

				try {
					await axiosInstance.post('/v1/products/bulk', jsonData);

					fetchProducts();

					message.success('Products imported successfully');
				} catch (error) {
					message.error('Error importing products');
				}
			},
			header: true,
			skipEmptyLines: true,
		});
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div className='p-3'>
			{/* Top Header */}
			<div className='flex flex-col justify-center'>
				<div className='flex flex-row items-center gap-2 justify-between'>
					<div className='mb-4 sm360:mb-0'>
						<h2 className='font-bold text-lg md:text-2xl mb-2 sm360:mb-0'>
							Product Details
						</h2>

						<Breadcrumb
							items={[
								{
									title: <Link href='/admin/dashboard'>Dasboard</Link>,
								},
								{
									title: 'Product',
								},
							]}
						/>
					</div>

					<div className='my-2 flex flex-col justify-center items-end'>
						<div className='flex flex-row gap-2 justify-end items-center w-full'>
							{/* <FileImport handleImportProducts={handleImportProducts} /> */}

							<Button
								type='primary'
								className='flex flex-row gap-2 justify-center items-center'
								onClick={() => setShowAddProductDrawer(true)}
							>
								<span>
									<PlusIcon size={18} />
								</span>
								<span>Add Product</span>
							</Button>
						</div>
						<div className='mt-2'>
							<SearchBar
								placeholder={'Search Products'}
								onChange={(event) => {
									handleProductSearch(event);
								}}
								isLoading={loading}
							/>
						</div>
					</div>
				</div>
				<div className='mt-5'>
					<ProductFilters
						categoryFilterVisibilty={true}
						newSortOptions={[
							{
								label: 'Total Sales: High to Low',
								value: 'soldCount_desc',
							},
							{
								label: 'Total Sales: Low to High',
								value: 'soldCount_asc',
							},
							{
								label: 'Stock: High to Low',
								value: 'stockCount_desc',
							},
							{
								label: 'Stock: Low to High',
								value: 'stockCount_asc',
							},
						]}
					/>
				</div>
			</div>

			{/* Content */}
			<div className='bg-slate-200 min-h-screen rounded-lg'>
				<ProductTable />
			</div>

			<AddProduct
				drawerVisible={showAddProductDrawer}
				setDrawerVisible={setShowAddProductDrawer}
			/>
		</div>
	);
};

export default ProductPage;
