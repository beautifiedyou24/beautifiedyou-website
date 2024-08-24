import { ProductType } from '@/components/Products/types/product.type';
import useProductStore from '@/store/productStore';
import axiosInstance from '@/utils/axiosConfig';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Badge, Button, Modal, Tag, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { BadgeCentIcon, PencilLineIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';

const { confirm } = Modal;

const handleDelete = async (
	record: ProductType,
	removeProduct: (productId: string) => void
) => {
	confirm({
		title: 'Are you sure to delete this product?',
		icon: <ExclamationCircleFilled />,
		okText: 'Yes',
		okType: 'danger',
		cancelText: 'No',
		async onOk() {
			try {
				await axiosInstance.delete(`/v1/products/${record.id}`);
				removeProduct(record.id);
			} catch (error) {
				console.error('Failed to delete product:', error);
			}
		},
	});
};

export const CreateProductColumns = (
	onEdit: (product: ProductType) => void,
	onView: (product: ProductType) => void,
	onEditDiscount: (product: ProductType) => void
): ColumnType<ProductType>[] => {
	const removeProduct = useProductStore((state) => state.removeProduct);

	const setSelectedProduct = useProductStore(
		(state) => state.setSelectedProduct
	);

	return [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '25%', // Added width for responsiveness
			render: (text, record) => (
				<div className='flex flex-row items-center w-full'>
					<Badge
						size='small'
						count={
							record.discount && parseFloat(record.discount?.percentage) > 0
								? String(
										Math.round(parseFloat(record.discount.percentage) * 100)
								  ) + '%'
								: null
						}
						style={{ backgroundColor: 'yellow', color: 'black' }}
						offset={[-15, -3]}
					>
						<Image
							src={
								record.images.length > 0
									? record.images[0]
									: '/images/default-product.png'
							}
							alt={record.name}
							width={60}
							height={60}
							className='rounded-md'
						/>
					</Badge>
					<div className='ml-2 w-8/12'>
						<p className='font-semibold text-sm'>{record.name}</p>
						<p>{record?.meta?.imageObj?.length} shades</p>
					</div>
				</div>
			),
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			width: '10%', // Added width for responsiveness
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
		},
		{
			title: 'Discounted Price',
			// dataIndex: 'price',
			// key: 'price',
			width: '10%', // Added width for responsiveness
			render: (text, record) => (
				<p className='font-bold'>{record.finalPrice}</p>
			),
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
		},
		{
			title: 'Stock Count',
			dataIndex: 'stockCount',
			key: 'stockCount',
			width: '10%', // Added width for responsiveness
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
		},
		{
			title: 'Total Sales',
			dataIndex: 'soldCount',
			key: 'soldCount',
			width: '10%',
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			render: (soldCount) => <p className='font-bold'>{soldCount}</p>,
		},
		{
			title: 'Categories',
			dataIndex: 'categories',
			key: 'categories',
			width: '10%',
			render: (categories: string[]) => (
				<>
					{categories.map((category) => (
						<Tag key={category} color='geekblue' className='font-bold'>
							{category}
						</Tag>
					))}
				</>
			),
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
		},
		{
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			width: '50%', // Added width for responsiveness
			render: (text) => {
				const truncatedText =
					text.length > 100 ? text.slice(0, 100) + '...' : text;
				return <span>{truncatedText}</span>;
			},
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
		},
		{
			title: 'Action',
			key: 'action',
			width: '20%', // Added width for responsiveness
			render: (_, record) => (
				<div className='flex flex-row gap-2 justify-center items-center'>
					<Button
						type='primary'
						icon={<PencilLineIcon size={15} color='white' />}
						onClick={() => {
							setSelectedProduct(record);
							onEdit(record);
						}}
					/>

					<Button
						danger
						icon={<TrashIcon size={15} color='red' />}
						onClick={() => handleDelete(record, removeProduct)}
					/>

					<Tooltip title='Edit Discount'>
						<Button
							type='primary'
							icon={<BadgeCentIcon size={18} />}
							onClick={() => {
								setSelectedProduct(record);
								onEditDiscount(record);
							}}
							className='discount-button'
						/>
					</Tooltip>
				</div>
			),
		},
	];
};
