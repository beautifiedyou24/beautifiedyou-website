'use client';

import CategoryWiseProductPage from '@/components/CategoryWiseProductPage';
import useCategoryStore from '@/store/categoryStore';
import { useEffect, useState } from 'react';

export default function CategoryDetails({ params }: { params: any }) {
	const { fetchSingleCategory, category } = useCategoryStore();
	const [catName, setCatName] = useState('');

	useEffect(() => {
		fetchSingleCategory(params.slug);
	}, [fetchSingleCategory, params.slug]);

	useEffect(() => {
		setCatName(category?.name);
	}, [category]);

	return (
		<div>
			<CategoryWiseProductPage slug={params.slug} categoryName={catName} />
		</div>
	);
}
