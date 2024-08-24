import useCategoryStore from '@/store/categoryStore';
import axiosInstance from '@/utils/axiosConfig';
import uploadToCloudinary from '@/utils/uploadImage';
import { EyeOutlined, InboxOutlined } from '@ant-design/icons';
import {
	Button,
	Form,
	Image,
	Input,
	Modal,
	Upload,
	UploadFile,
	message,
} from 'antd';
import React, { useState } from 'react';

const { Dragger } = Upload;

interface AddCategoryProps {
	drawerVisible: boolean;
	setDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddCategory = ({ drawerVisible, setDrawerVisible }: AddCategoryProps) => {
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [loading, setLoading] = useState(false);

	const addCategory = useCategoryStore((state) => state.addCategory);
	const fetchCategories = useCategoryStore((state) => state.fetchCategories);

	const closeDrawer = () => {
		setDrawerVisible(false);
		form.resetFields();
		setFileList([]);
	};

	const onFinish = async (values: any) => {
		setLoading(true);
		try {
			let formData = { ...values };

			if (fileList.length > 0) {
				const imageUrls = await uploadToCloudinary(fileList);
				formData = { ...values, image: imageUrls[0] };
			} else {
				formData = { ...values, image: 'No Image' };
			}

			const response = await axiosInstance.post('/v1/categories', formData);
			const uploadedCategory = response.data.data;
			addCategory(uploadedCategory);

			message.success('Category Created Successfully! 🎉🎉');
			fetchCategories(1);
			closeDrawer();
		} catch (error) {
			message.error('Failed to upload image to Cloudinary');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
		setFileList(fileList);
	};

	const beforeUpload = (file: { size: any }) => {
		const isLt8M = (file?.size ?? 0) / 1024 / 1024 < 8;
		if (!isLt8M) {
			message.error('Image must be smaller than 8MB!');
		}
		return isLt8M || Upload.LIST_IGNORE;
	};

	const handlePreview = (file: any) => {
		if (!file.url && !file.preview) {
			file.preview = getBase64(file.originFileObj);
		}

		setPreviewImage(file.url || file.preview);
		setPreviewVisible(true);
	};

	const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	return (
		<div>
			<Modal
				title='Create new category'
				width={600}
				onCancel={closeDrawer}
				open={drawerVisible}
				style={{ paddingBottom: 80 }}
				maskClosable={false}
				footer={null}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={onFinish}
					style={{ marginTop: '25px' }}
				>
					<Form.Item
						name='name'
						label='Name'
						rules={[
							{ required: true, message: 'Please enter the category name' },
						]}
					>
						<Input placeholder='Please enter the category name' />
					</Form.Item>

					<Form.Item
						name='details'
						label='Description'
						rules={[
							{
								required: true,
								message: 'Please enter the category details',
							},
						]}
					>
						<Input.TextArea
							rows={4}
							placeholder='Please enter the category details'
						/>
					</Form.Item>

					<Form.Item
						name='image'
						label='Upload Image'
						valuePropName='fileList'
						getValueFromEvent={handleChange}
					>
						{/* <ImgCrop showGrid={true} showReset={true} aspect={}> */}
						<Dragger
							listType='picture-card'
							fileList={fileList}
							onChange={handleChange}
							beforeUpload={beforeUpload}
							onPreview={handlePreview}
							multiple={false}
							iconRender={() => <EyeOutlined />}
						>
							<p className='ant-upload-drag-icon'>
								<InboxOutlined />
							</p>
							<p className='ant-upload-text'>
								Click or drag file to this area to upload
							</p>
							<p className='ant-upload-hint'>Support for single upload only.</p>
						</Dragger>
						{/* </ImgCrop> */}
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit' loading={loading}>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				open={previewVisible}
				title='Image Preview'
				footer={null}
				onCancel={() => setPreviewVisible(false)}
			>
				<Image alt='example' style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</div>
	);
};

export default AddCategory;
