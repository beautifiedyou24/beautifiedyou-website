'use client';

import AddCategory from '@/components/Categories/AddCategories';
import CategoryTable from '@/components/Categories/CategoryTable';

import { Breadcrumb, Button } from 'antd';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const CategoriesPage = () => {
	const [showCategoryDrawer, setShowCategoryDrawer] = useState<boolean>(false);

	return (
		<div className='p-3'>
			{/* Top Header */}
			<div className='flex flex-row items-center gap-2 justify-between'>
				<div className='mb-4 sm360:mb-0'>
					<h2 className='font-bold text-lg md:text-2xl mb-2 sm360:mb-0'>
						Category Details
					</h2>

					<Breadcrumb
						items={[
							{
								title: <Link href='/admin/dashboard'>Dasboard</Link>,
							},
							{
								title: 'Category',
							},
						]}
					/>
				</div>

				<div>
					<Button
						type='primary'
						className='flex flex-row gap-2 justify-center items-center'
						onClick={() => setShowCategoryDrawer(true)}
					>
						<span>
							<PlusIcon size={18} />
						</span>
						<span>Add Category</span>
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className='bg-slate-200 min-h-screen rounded-lg'>
				<CategoryTable />
			</div>

			<AddCategory
				drawerVisible={showCategoryDrawer}
				setDrawerVisible={setShowCategoryDrawer}
			/>
		</div>
	);
};

export default CategoriesPage;
