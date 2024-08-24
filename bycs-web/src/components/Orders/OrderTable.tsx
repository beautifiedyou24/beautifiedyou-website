'use client';

import BaseTable from '@/components/shared/BaseTable';
import { PAGING_DATA } from '@/constants/common';
import { useOrderStore } from '@/store/orderStore';
import { useEffect, useState } from 'react';
import { CreateOrderColumns } from './elements/columns';
import OrderEdit from './OrderEdit';
import OrderView from './OrderView';
import { OrderType } from './types/order.type';

const OrderTable = () => {
	const [pageLimit, setPageLimit] = useState(PAGING_DATA.limit);
	const [currentPage, setCurrentPage] = useState(PAGING_DATA.page);

	const [isViewModalVisible, setIsViewModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);

	const { orders, orderMeta } = useOrderStore();
	const fetchOrders = useOrderStore((state) => state.fetchOrders);
	const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);
	const clearSelectedOrder = useOrderStore((state) => state.clearSelectedOrder);

	const handleEdit = (record: OrderType) => {
		setSelectedOrder(record);
		setIsEditModalVisible(true);
	};

	const handleView = (record: OrderType) => {
		setSelectedOrder(record);
		setIsViewModalVisible(true);
	};

	const handleCloseView = () => {
		clearSelectedOrder();
		setIsViewModalVisible(false);
	};

	const handleCloseEdit = () => {
		clearSelectedOrder();
		setIsEditModalVisible(false);
	};

	const orderColumns = CreateOrderColumns(handleEdit, handleView);

	useEffect(() => {
		fetchOrders(currentPage, '', '', '', '', pageLimit);
	}, [fetchOrders, currentPage, pageLimit]);

	return (
		<div className='p-2'>
			<BaseTable
				columns={orderColumns}
				data={orders}
				dataCount={orderMeta?.totalFilteredItemCount}
				loading={false}
			/>
			<OrderView visible={isViewModalVisible} onClose={handleCloseView} />
			<OrderEdit visible={isEditModalVisible} onClose={handleCloseEdit} />
		</div>
	);
};

export default OrderTable;
