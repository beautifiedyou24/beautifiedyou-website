'use client';

import BaseTable from '@/components/shared/BaseTable';
import useFilterStore from '@/store/filterStore';
import useProductStore from '@/store/productStore';
import { useEffect, useState } from 'react';
import DiscountModal from '../shared/DiscountModal';
import ProductEdit from './ProductEdit';
import ProductView from './ProductView';
import { CreateProductColumns } from './elements/columns';
import { ProductType } from './types/product.type';

const ProductTable = () => {
	const { filterParams } = useFilterStore();
	const { priceRange, filterCategories, sortOption, currentPage, pageLimit } =
		filterParams;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isViewModalVisible, setIsViewModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);

	const { products, fetchProducts, productMeta } = useProductStore();

	const handleDiscount = () => {
		setIsModalVisible(true);
	};

	const handleCloseDiscountModal = () => {
		clearSelectedProduct();
		setIsModalVisible(false);
	};

	const setSelectedProduct = useProductStore(
		(state) => state.setSelectedProduct
	);
	const clearSelectedProduct = useProductStore(
		(state) => state.clearSelectedProduct
	);

	const handleEdit = (record: ProductType) => {
		setSelectedProduct(record);
		setIsEditModalVisible(true);
	};

	const handleView = (record: ProductType) => {
		setSelectedProduct(record);
		setIsViewModalVisible(true);
	};

	const handleCloseView = () => {
		clearSelectedProduct();
		setIsViewModalVisible(false);
	};

	const handleCloseEdit = () => {
		clearSelectedProduct();
		setIsEditModalVisible(false);
	};

	const productColumns = CreateProductColumns(
		handleEdit,
		handleView,
		handleDiscount
	);

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

	return (
		<div className='p-2'>
			<BaseTable
				columns={productColumns}
				data={products}
				dataCount={productMeta?.totalFilteredItemCount}
				loading={false}
			/>
			<ProductView visible={isViewModalVisible} onClose={handleCloseView} />
			<ProductEdit visible={isEditModalVisible} onClose={handleCloseEdit} />
			<DiscountModal
				visible={isModalVisible}
				onClose={handleCloseDiscountModal}
			/>
		</div>
	);
};

export default ProductTable;
