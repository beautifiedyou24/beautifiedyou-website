import formatDate from '@/utils/helper';
import { renderStatusTag } from '@/utils/RenderStatusTag';
import { Button } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PencilLineIcon } from 'lucide-react';
import { OrderType } from '../types/order.type';

dayjs.extend(customParseFormat);

export const CreateOrderColumns = (
	onEdit: (order: OrderType) => void,
	onView: (order: OrderType) => void
): ColumnType<OrderType>[] => {
	return [
		{
			title: 'Order Number',
			dataIndex: 'orderNumber',
			key: 'orderNumber',
			render: (orderId) => <p className='font-extrabold'>#{orderId}</p>,
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			sorter: (a, b) => a.orderNumber - b.orderNumber,
			rowScope: 'row',
			width: 60,
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			render: (date) => formatDate(date),
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
			width: 140,
		},
		{
			title: 'Customer Name',
			dataIndex: 'customerName',
			key: 'customerName',
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			sorter: (a, b) => a.customerName.localeCompare(b.customerName),
			width: 100,
		},
		{
			title: 'Mobile No.',
			dataIndex: 'phone_1',
			key: 'phone_1',
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			width: 100,
		},
		{
			title: 'Total',
			dataIndex: 'totalPrice',
			key: 'totalPrice',
			render: (price) => `${price.toFixed(2)} /-`,
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			sorter: (a, b) => a.totalPrice - b.totalPrice,
			width: 100,
		},
		{
			title: 'Items',
			dataIndex: 'items',
			key: 'items',
			render: (item) => item.length.toString() + ' items',
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			width: 100,
		},
		{
			title: 'Delivery Status',
			dataIndex: 'deliveryStatus',
			key: 'deliveryStatus',
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			render: (status) => renderStatusTag(status),
			filters: [
				{
					text: 'Processing',
					value: 'Processing',
				},
				{
					text: 'Dispatched',
					value: 'Dispatched',
				},
				{
					text: 'Delivered',
					value: 'Delivered',
				},
				{
					text: 'Cancelled',
					value: 'Cancelled',
				},
			],
			onFilter: (value, record) => {
				return record.deliveryStatus === value;
			},
			filterSearch: true,
			width: 100,
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Button
					onClick={() => onEdit(record)}
					icon={<PencilLineIcon size={15} color='blue' />}
				/>
			),
			width: 100,
		},
	];
};
