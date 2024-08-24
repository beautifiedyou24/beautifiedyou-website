import useCategoryStore from '@/store/categoryStore';
import axiosInstance from '@/utils/axiosConfig';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { ColumnType } from 'antd/es/table';
import { PencilLineIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { CategoryType } from '../types/category.type';

const { confirm } = Modal;

const handleDelete = async (
	record: CategoryType,
	removeCategory: (categoryId: string) => void
) => {
	confirm({
		title: 'Are you sure to delete this category?',
		icon: <ExclamationCircleFilled />,
		okText: 'Yes',
		okType: 'danger',
		cancelText: 'No',
		async onOk() {
			try {
				await axiosInstance.delete(`/v1/categories/${record.id}`);
				removeCategory(record.id);
			} catch (error) {
				console.error('Failed to delete category:', error);
			}
		},
	});
};

export const CreateCategoryColumns = (
	onEdit: (category: CategoryType) => void,
	onView: (category: CategoryType) => void
): ColumnType<CategoryType>[] => {
	const removeCategory = useCategoryStore((state) => state.removeCategory);

	return [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => (
				<div className='flex flex-row items-center w-full'>
					{record.image && (
						<Image
							src={record.image}
							alt={record.name}
							width={60}
							height={60}
							className='rounded-md'
						/>
					)}
					<p className='font-semibold text-blue-500 w-8/12 ml-2'>{record.name}</p>
				</div>
			),
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			sorter: (a, b) => a.name.localeCompare(b.name),
			width: '20%',
		},
		{
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			render: (text) => <p dangerouslySetInnerHTML={{ __html: text }} />,
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			width: '50%',
		},
		{
			title: 'Product Counts',
			dataIndex: 'productCount',
			key: 'productCount',
			onCell: (record) => ({
				onClick: () => onView(record),
			}),
			width: '10%',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<>
					<Button
						type='primary'
						icon={<PencilLineIcon size={15} color='white' />}
						onClick={() => onEdit(record)}
						style={{ marginRight: '8px' }}
					/>
					<Button
						danger
						icon={<TrashIcon size={15} color='red' />}
						onClick={() => {
							handleDelete(record, removeCategory);
						}}
					/>
				</>
			),
			width: '30%',
		},
	];
};
