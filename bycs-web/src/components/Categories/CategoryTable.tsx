'use client';

import BaseTable from '@/components/shared/BaseTable';
import { PAGING_DATA } from '@/constants/common';
import useCategoryStore from '@/store/categoryStore';
import { useEffect, useState } from 'react';
import CategoryEdit from './CategoryEdit';
import { CreateCategoryColumns } from './elements/columns';
import { CategoryType } from './types/category.type';

const CategoryTable = () => {
	const [pageLimit, setPageLimit] = useState(PAGING_DATA.limit);
	const [currentPage, setCurrentPage] = useState(PAGING_DATA.page);

	const [isViewModalVisible, setIsViewModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);

	const categories = useCategoryStore((state) => state.categories);
	const fetchCategorys = useCategoryStore((state) => state.fetchCategories);
	const updateCategory = useCategoryStore((state) => state.updateCategory);
	const setSelectedCategory = useCategoryStore(
		(state) => state.setSelectedCategory
	);
	const clearSelectedCategory = useCategoryStore(
		(state) => state.clearSelectedCategory
	);

	const handleEdit = (record: CategoryType) => {
		setSelectedCategory(record);
		setIsEditModalVisible(true);
	};

	const handleSave = (newCategoryDetails: CategoryType) => {
		updateCategory(newCategoryDetails);
		setIsEditModalVisible(false);
	};

	const handleView = (record: CategoryType) => {
		setSelectedCategory(record);
		setIsViewModalVisible(true);
	};

	const handleCloseView = () => {
		clearSelectedCategory();
		setIsViewModalVisible(false);
	};

	const handleCloseEdit = () => {
		clearSelectedCategory();
		setIsEditModalVisible(false);
	};

	const categoryColumns = CreateCategoryColumns(handleEdit, handleView);

	useEffect(() => {
		fetchCategorys(1);
	}, [fetchCategorys]);

	return (
		<div className='p-2'>
			<p className='text-red-500 my-3'>
				* If Product Count greater than 0 then DO NOT DELETE that CATEGORY
			</p>
			<BaseTable columns={categoryColumns} data={categories} loading={false} />
			<CategoryEdit
				visible={isEditModalVisible}
				onClose={handleCloseEdit}
				onSave={handleSave}
			/>
		</div>
	);
};

export default CategoryTable;
