import useCategoryStore from '@/store/categoryStore';
import useProductStore from '@/store/productStore';
import axiosInstance from '@/utils/axiosConfig';
import { createOptions } from '@/utils/helper';
import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Upload,
	UploadFile,
	message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import CategoryModal from '../Categories/CategoryModal';
import ImageImport from '../shared/ImageImport';

const { Dragger } = Upload;

interface AddProductProps {
	drawerVisible: boolean;
	setDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProduct = ({ drawerVisible, setDrawerVisible }: AddProductProps) => {
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [imageObjects, setImageObjects] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState();

	const categories = useCategoryStore((state) => state.categories);
	const fetchCategories = useCategoryStore((state) => state.fetchCategories);
	const addProduct = useProductStore((state) => state.addProduct);

	useEffect(() => {
		fetchCategories(1);
	}, [fetchCategories]);

	useEffect(() => {
		setOptions(createOptions(categories.map((value) => value.name)));
	}, [categories]);

	const closeDrawer = () => {
		setDrawerVisible(false);
		form.resetFields();
		setFileList([]);
	};

	const onFinish = async (values: any) => {
		setLoading(true);

		try {
			if (imageObjects?.length == 0) {
				message.error('Add Product Images');
				return;
			}

			const { colors, ...rest } = values;
			const imageObj = imageObjects;
			const imageUrls = imageObjects?.map((obj) => {
				const color = Object.keys(obj)[0];
				const [url] = obj[color];
				return url;
			});

			let formData = {
				...rest,
				images: imageUrls,
				meta: { imageObj },
				categories: [values.categories],
			};

			const response = await axiosInstance.post('/v1/products', formData);

			const uploadedProduct = response.data.data;
			addProduct(uploadedProduct);

			message.success('Product Created Successfully! 🎉🎉');
			fetchCategories();
			closeDrawer();
			setImageObjects([]);
		} catch (error) {
			message.error('Something wrong! Check all required fields');
		} finally {
			setLoading(false);
		}
	};

	const handleImageAndColorImport = (objects: any[], stock: number) => {
		console.log('Invoked Image and Color component', objects);
		setImageObjects(objects);
		// setStockCount(stock);
		form.setFieldsValue({
			stockCount: stock,
		});
	};

	return (
		<div>
			<Modal
				title='Create new product'
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
					{/* name */}
					<Form.Item
						name='name'
						label='Name'
						rules={[
							{ required: true, message: 'Please enter the product name' },
						]}
					>
						<Input
							className='h-8 text-sm border-gray-300'
							placeholder='Please enter the product name'
						/>
					</Form.Item>

					{/* price and stock count */}
					<Row gutter={16}>
						<Col xs={24} sm={12}>
							<Form.Item
								name='price'
								label='Price'
								rules={[
									{ required: true, message: 'Please enter the product price' },
								]}
							>
								<InputNumber
									style={{ width: '100%' }}
									min={0}
									placeholder='Please enter the product price'
									className='rounded-none'
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item name='stockCount' label='Stock Count'>
								<InputNumber
									style={{ width: '100%' }}
									min={0}
									placeholder='0'
									className='rounded-none'
									disabled
								/>
							</Form.Item>
						</Col>
					</Row>

					{/* description */}
					<Form.Item
						name='details'
						label='Details'
						rules={[
							{ required: true, message: 'Please enter the product details' },
						]}
					>
						<Input.TextArea
							rows={4}
							placeholder='Please enter the product details'
						/>
					</Form.Item>

					{/* category */}
					<Form.Item
						name='categories'
						label='Category'
						rules={[{ required: true, message: 'Please select a category' }]}
					>
						<Select
							placeholder='Please select a category'
							dropdownRender={(menu) => (
								<>
									{menu}
									<CategoryModal />
								</>
							)}
							options={options}
							optionFilterProp='label'
							showSearch
						/>
					</Form.Item>

					{/* image &   */}
					<Form.Item name='image_color_pair' label='Upload Images'>
						<div className='mb-2 font-semibold text-coreBrown flex justify-center items-center'>
							{imageObjects.length} images uploaded
						</div>
						<ImageImport handleImageObjects={handleImageAndColorImport} />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit' loading={loading}>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			{/* <Modal
				open={previewVisible}
				title='Image Preview'
				footer={null}
				onCancel={() => setPreviewVisible(false)}
			>
				<Image alt='example' style={{ width: '100%' }} src={previewImage} />
			</Modal> */}
		</div>
	);
};

export default AddProduct;
