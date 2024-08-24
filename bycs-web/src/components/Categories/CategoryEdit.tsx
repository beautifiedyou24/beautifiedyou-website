import useCategoryStore from '@/store/categoryStore';
import axiosInstance from '@/utils/axiosConfig';
import uploadToCloudinary from '@/utils/uploadImage';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { CategoryType } from './types/category.type';

interface CategoryEditProps {
	visible: boolean;
	onClose: () => void;
	onSave: (values: CategoryType) => void;
}

const CategoryEdit = ({ visible, onClose, onSave }: CategoryEditProps) => {
	const [form] = Form.useForm();
	const selectedCategory = useCategoryStore((state) => state.selectedCategory);
	const updateCategory = useCategoryStore((state) => state.updateCategory);

	const categoryDetails = selectedCategory;

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (categoryDetails) {
			form.setFieldsValue(categoryDetails);
			const initialFileList = categoryDetails.image
				? [
						{
							uid: '-1',
							name: 'image.png',
							status: 'done',
							url: categoryDetails.image,
						},
				  ]
				: [];
			setFileList(initialFileList as any);
		}
	}, [categoryDetails, form]);

	const handleFinish = async (values: CategoryType) => {
		setUploading(true);
		try {
			const newImages = fileList.filter((file) => !file.url);
			const existingImages = fileList
				.filter((file) => file.url)
				.map((file) => file.url);

			const uploadedImageUrls = await uploadToCloudinary(newImages);
			const updatedCategory = {
				...values,
				image:
					uploadedImageUrls.length > 0
						? uploadedImageUrls[0]
						: existingImages[0],
			};

			const response = await axiosInstance.put(
				`/v1/categories/${categoryDetails?.id}`,
				updatedCategory
			);

			const uploadedCategory = response.data.data;
			updateCategory(uploadedCategory);

			message.success('Category Updated Successfully! 🎉🎉');
			onClose();
		} catch (error: any) {
			message.error(error?.response?.data?.error?.details);
		} finally {
			setUploading(false);
		}
	};

	const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
		setFileList(fileList);
	};

	const beforeUpload = (file: { size: number }) => {
		const isLt8M = file.size / 1024 / 1024 < 8;
		if (!isLt8M) {
			message.error('Image must be smaller than 8MB!');
		}
		return isLt8M || Upload.LIST_IGNORE;
	};

	return (
		<Modal
			title='Edit Category'
			open={visible}
			onCancel={onClose}
			footer={[
				<Button key='cancel' onClick={onClose} disabled={uploading}>
					Cancel
				</Button>,
				<Button
					key='save'
					type='primary'
					onClick={() => form.submit()}
					loading={uploading}
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={handleFinish}
				initialValues={categoryDetails as CategoryType}
			>
				<Form.Item
					name='name'
					label='Category Name'
					rules={[
						{ required: true, message: 'Please enter the category name' },
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name='details'
					label='Description'
					rules={[{ required: true, message: 'Please enter the details' }]}
				>
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item name='image' label='Image'>
					{/* <ImgCrop> */}
					<Upload
						listType='picture-card'
						fileList={fileList}
						onChange={handleFileChange}
						beforeUpload={beforeUpload}
						multiple={false}
						iconRender={() => <EyeOutlined />}
					>
						{fileList.length >= 1 ? null : (
							<div>
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>Upload</div>
							</div>
						)}
					</Upload>
					{/* </ImgCrop> */}
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CategoryEdit;
