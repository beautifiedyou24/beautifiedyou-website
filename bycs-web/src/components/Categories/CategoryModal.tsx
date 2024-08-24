import useCategoryStore from '@/store/categoryStore';
import axiosInstance from '@/utils/axiosConfig';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, message } from 'antd';
import { useState } from 'react';

const ManageCategories = () => {
	const [categoryModalVisible, setCategoryModalVisible] = useState(false);
	const [newCategory, setNewCategory] = useState('');
	const addCategory = useCategoryStore((state) => state.addCategory);
	const fetchCategories = useCategoryStore((state) => state.fetchCategories);

	const openCategoryModal = () => {
		setCategoryModalVisible(true);
	};

	const handleCreateCategory = async () => {
		try {
			const response = await axiosInstance.post('/v1/categories', {
				name: newCategory,
			});
			
			const newCat = { label: response.data.name, value: response.data.name };

			addCategory(newCat);
			fetchCategories(1);
			setCategoryModalVisible(false);
			setNewCategory('');
			message.success('Category created successfully!');

		} catch (error) {
			message.error('Failed to create category');
		}
	};

	return (
		<>
			<Button
				type='link'
				style={{ width: '100%', textAlign: 'left' }}
				onClick={openCategoryModal}
			>
				<PlusOutlined /> Add category
			</Button>
			<Modal
				title='Create new category'
				open={categoryModalVisible}
				onCancel={() => setCategoryModalVisible(false)}
				onOk={handleCreateCategory}
				okText='Create'
			>
				<Input
					placeholder='Enter category name'
					value={newCategory}
					onChange={(e) => setNewCategory(e.target.value)}
				/>
			</Modal>
		</>
	);
};

export default ManageCategories;
