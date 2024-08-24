import useCategoryStore from '@/store/categoryStore';
import useProductStore from '@/store/productStore';
import axiosInstance from '@/utils/axiosConfig';
import { createOptions } from '@/utils/helper';
import uploadToCloudinary from '@/utils/uploadImage';
import { DeleteFilled, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Card } from '@tremor/react';
import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	List,
	Modal,
	Row,
	Select,
	Upload,
	message,
} from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import CategoryModal from '../Categories/CategoryModal';
import ImageImport from '../shared/ImageImport';
import EditListItem from './elements/EditListItem';
import { ProductType } from './types/product.type';

interface ProductEditProps {
	visible: boolean;
	onClose: () => void;
}

const ProductEdit = ({ visible, onClose }: ProductEditProps) => {
	const [form] = Form.useForm();

	const selectedProduct = useProductStore((state) => state.selectedProduct);
	const updateProduct = useProductStore((state) => state.updateProduct);

	const [itemList, setItemList] =
		useState<{ image: any; color: string; hex: any; stock: any }[]>();
	const [showEditListModal, setShowEditListModal] = useState<boolean>(false);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploading, setUploading] = useState(false);
	const [imageObjects, setImageObjects] = useState<any[]>([]);
	const [selectedListItem, setSelectedListItem] = useState<{
		image: any;
		color: string;
		hex: any;
		stock: any;
	}>();

	const productDetails = selectedProduct;
	const [options, setOptions] = useState();

	const categories = useCategoryStore((state) => state.categories);

	useEffect(() => {
		setOptions(createOptions(categories.map((value) => value.name)));
	}, [categories]);

	const handleFinish = async (values: any) => {
		setUploading(true);
		try {
			// image object
			const imageObj: { [key: string]: [string, string, number] }[] = [];
			if (itemList && itemList.length > 0) {
				itemList.forEach((item: any) => {
					imageObj.push({ [item.color]: [item.image, item.hex, item.stock] });
				});
			}

			// get all image urls
			const imageURLs = itemList?.map((item: any) => item.image) || [];
			const newImages = fileList.filter((file) => !file.url);
			let finalImageURLs;

			if (newImages.length > 0) {
				const uploadedImageUrls = await uploadToCloudinary(newImages);
				finalImageURLs = [...imageURLs, ...uploadedImageUrls];
			} else {
				finalImageURLs = imageURLs;
			}

			// final stock count
			const finalStockCount = itemList
				?.map((item) => item.stock)
				.reduce((total, acc) => total + acc, 0);

			form.setFieldValue('stockCount', finalStockCount);

			// final object
			let formData = {
				...values,
				images: finalImageURLs,
				stockCount: finalStockCount,
				meta: { imageObj: imageObj },
				categories: [values.categories],
			};

			console.log('FORM DATA: ', formData);

			const response = await axiosInstance.put(
				`/v1/products/${productDetails?.id}`,
				formData
			);

			const uploadedProduct = response.data.data;
			updateProduct(uploadedProduct);
			setImageObjects([]);

			message.success('Product Updated Successfully! 🎉🎉');
			onClose();
		} catch (error) {
			message.error('Failed to upload images. Please try again.');
		} finally {
			setUploading(false);
		}
	};

	const handleUpdatedListItem = (updatedList: any[]) => {
		setItemList(updatedList);
	};

	const hanleCloseEditListItem = () => {
		setShowEditListModal(false);
	};

	const handleRemoveItem = (product: any) => {
		if (!itemList) return;

		// Find the index of the item to be removed
		const itemIndex = itemList.findIndex(
			(item) => item.color === product.color
		);

		if (itemIndex !== -1) {
			// Create a new array without the item to be removed
			const updatedItemList = [
				...itemList.slice(0, itemIndex),
				...itemList.slice(itemIndex + 1),
			];

			// Update the state with the new list
			setItemList(updatedItemList);
			const currentStock = form.getFieldValue('stockCount');
			form.setFieldValue('stockCount', currentStock - product.stock);
		}
	};

	const handleImageAndColorImport = (objects: any[], stock: number) => {
		console.log('Invoked Image and Color component', objects);
		setImageObjects(objects);

		if (objects) {
			const options = objects.map((obj) => {
				const [colorName, [imageUrl, colorCode, stock]] = Object.entries(
					obj
				)[0] as [string, [string, string, number]];
				return {
					image: imageUrl,
					color: colorName,
					hex: colorCode,
					stock: stock,
				};
			});

			console.log('NEW ITEM LIST CHECK ', [...(itemList || []), ...options]);

			setItemList((prev) => [...(prev || []), ...options]);
		}
	};

	useEffect(() => {
		if (productDetails) {
			form.setFieldsValue(productDetails);
			const initialFileList =
				productDetails.images?.map((image, index) => ({
					uid: `${index}`,
					name: `image-${index}.png`,
					status: 'done',
					url: image,
				})) || [];
			setFileList(initialFileList as any);
			console.log('INITIAL FILE: ', initialFileList);
		}
	}, [productDetails, form, visible]);

	useEffect(() => {
		console.log('PRODUCT IMG: ', selectedProduct);
		if (productDetails?.meta?.imageObj) {
			if (productDetails?.meta?.imageObj) {
				const options = productDetails?.meta?.imageObj.map((obj) => {
					const [colorName, [imageUrl, colorCode, stock]] =
						Object.entries(obj)[0];
					return {
						image: imageUrl,
						color: colorName,
						hex: colorCode,
						stock: stock,
					};
				});

				console.log('first', options);

				setItemList(options);
			}
		}
	}, [visible]);

	const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
		setFileList(fileList);
	};

	return (
		<Modal
			title='Edit Product'
			open={visible}
			width={650}
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
					Save Changes
				</Button>,
			]}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={handleFinish}
				initialValues={productDetails as ProductType}
			>
				{/* name */}
				<Form.Item
					name='name'
					label='Product Name'
					rules={[{ required: true, message: 'Please enter the product name' }]}
				>
					<Input />
				</Form.Item>

				{/* description */}
				<Form.Item
					name='details'
					label='Description'
					rules={[
						{ required: true, message: 'Please enter the product description' },
					]}
				>
					<Input.TextArea rows={3} />
				</Form.Item>

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

				{/* price and stock count */}
				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							name='price'
							label='Price'
							rules={[{ required: true, message: 'Please enter the price' }]}
						>
							<InputNumber style={{ width: '100%' }} min={0} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							name='stockCount'
							label='Stock Count'
							rules={[
								{ required: true, message: 'Please enter the stock count' },
							]}
						>
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

				{/* List of item cards */}
				<Form.Item name='meta.imageObj' label='Colors and Stock'>
					<List
						dataSource={itemList || []}
						renderItem={(item, index) => (
							<List.Item>
								<Card className='w-full !p-0'>
									<div className='flex flex-row gap-2 w-full py-2'>
										<div className=' w-1/5 flex justify-center items-center'>
											<img
												src={item.image}
												alt={`Color ${index}`}
												width={50}
												height={50}
												className='rounded-md'
											/>
										</div>
										<div className=' w-3/5 flex justify-start items-center'>
											<div className='flex flex-col justify-center text-xs'>
												<p>
													<span className='font-semibold'>Color:</span>{' '}
													{item.color}
												</p>
												<p>
													<span className='font-semibold'>Hex:</span>{' '}
													{item.hex ? item.hex : 'N/A'}
												</p>
												<p>
													<span className='font-semibold'>Stock:</span>{' '}
													<span className='text-coreBrown'>{item.stock}</span>
												</p>
											</div>
										</div>
										<div className='w-1/5 flex flex-row pr-2 gap-2 justify-center items-center'>
											<Button
												type='primary'
												className='!bg-emerald-500'
												icon={<EditOutlined />}
												onClick={() => {
													setShowEditListModal(true);
													setSelectedListItem(item);
												}}
											></Button>
											<Button
												type='primary'
												danger
												icon={<DeleteFilled />}
												onClick={() => {
													handleRemoveItem(item);
												}}
											></Button>
										</div>
									</div>
								</Card>
							</List.Item>
						)}
					/>
				</Form.Item>

				{/* image import */}
				<Form.Item name='image_color_pair' label='Upload New Variants'>
					<ImageImport
						handleImageObjects={handleImageAndColorImport}
						buttonName='Add New Items'
					/>
				</Form.Item>

				<Form.Item name='images' label='Images'>
					<Upload
						listType='picture-card'
						fileList={fileList}
						onChange={handleFileChange}
						beforeUpload={() => false} // Prevent auto-upload
					>
						{fileList.length >= 8 ? null : (
							<div>
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>Upload</div>
							</div>
						)}
					</Upload>
				</Form.Item>
			</Form>

			<EditListItem
				visible={showEditListModal}
				onCancel={hanleCloseEditListItem}
				initialValues={selectedListItem}
				onSave={handleUpdatedListItem}
				itemList={itemList}
			/>
		</Modal>
	);
};

export default ProductEdit;
