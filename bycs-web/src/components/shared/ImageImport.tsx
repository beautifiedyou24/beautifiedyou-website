import uploadToCloudinary from '@/utils/uploadImage';
import { CloseOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons';
import {
	Button,
	GetProp,
	Image,
	Input,
	InputNumber,
	List,
	message,
	Modal,
	Upload,
	UploadFile,
	UploadProps,
} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface ProductData {
	url: string;
	color: string;
	hexValue?: string;
	stock: number;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const ImageImport = ({
	handleImageObjects,
	buttonName,
}: {
	handleImageObjects: (imageObjList: any[], stock: number) => void;
	buttonName?: string;
}) => {
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [productDataList, setProductDataList] = useState<ProductData[]>([]);
	const [imageObjList, setImageObjList] = useState<
		Array<Record<string, [string, string, number]>>
	>([]);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [colorName, setColorName] = useState<string>('');
	const [hexValue, setHexValue] = useState<string>('');
	const [stock, setStock] = useState<number>();
	const [loading, setLoading] = useState<boolean>();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setFileList([]);
		setPreviewImage('');
		setColorName('');
		setHexValue('');
		setStock(undefined);
		// setIsModalVisible(false);
	};

	const handleCancel = () => {
		setProductDataList([]);
		setColorName('');
		setHexValue('');
		setIsModalVisible(false);
	};

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as FileType);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
		setFileList(fileList);
	};

	const handleImageUpload = async () => {
		if (!colorName) {
			message.error('Enter the Color Name', 1);
			return;
		}

		if (!stock) {
			message.error('Enter the Stock Amount', 1);
			return;
		}

		if (fileList.length > 0) {
			const file = fileList[0];

			if (!file.url && !file.preview) {
				file.preview = await getBase64(file.originFileObj as FileType);
			}

			setLoading(true);
			const imageUrl = await uploadToCloudinary(fileList);
			// const imageUrl = file.url || (file.preview as string);

			const dataObj: ProductData = {
				url: imageUrl[0],
				color: colorName,
				hexValue: hexValue ?? '',
				stock: stock,
			};

			setProductDataList((prev) => [...prev, dataObj]);
			setImageObjList((prev) => [
				...prev,
				{
					[colorName]: [imageUrl[0], hexValue ?? '', stock],
				},
			]);

			setFileList([]);
			setPreviewImage('');
			setColorName('');
			setHexValue('');
			setStock(undefined);

			setLoading(false);
		} else {
			message.error('Select an Image', 1);
		}
	};

	const handleRemove = (color: string) => {
		setImageObjList((prev) =>
			prev.filter((item) => !item.hasOwnProperty(color))
		);
	};

	const beforeUpload = (file: { size: any }) => {
		const isLt8M = (file?.size ?? 0) / 1024 / 1024 < 8;
		if (!isLt8M) {
			message.error('Image must be smaller than 8MB!');
		}
		return isLt8M || Upload.LIST_IGNORE;
	};

	const calculateTotalStock = () => {
		const allStocks = imageObjList.map((item) => {
			const color = Object.keys(item)[0];
			const [, , stock] = item[color];
			return stock;
		});

		return allStocks.reduce((total, stock) => total + stock, 0);
	};

	return (
		<>
			<Button
				type='primary'
				className='flex flex-row gap-2 justify-center items-center text-white w-full'
				id='import-button'
				onClick={showModal}
			>
				<span>
					<PlusIcon size={18} />
				</span>
				<span>{buttonName ?? 'Add Items'}</span>
			</Button>

			<Modal
				title='Import Images'
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button
						key='done'
						onClick={async () => {
							const stock = calculateTotalStock();
							handleImageObjects(imageObjList, stock);
							setIsModalVisible(false);
							setImageObjList([]);
						}}
					>
						Done
					</Button>,
				]}
				maskClosable={false}
				width={550}
			>
				<div>
					<List
						dataSource={imageObjList}
						renderItem={(item) => {
							const color = Object.keys(item)[0];
							const [url, hexValue, stock] = item[color];

							return (
								<List.Item
									actions={[
										<Button
											type='text'
											key={color}
											onClick={() => handleRemove(color)}
											icon={<CloseOutlined />}
										/>,
									]}
								>
									<Image
										src={url}
										alt='Uploaded'
										style={{
											width: '100px',
											height: '50px',
											objectFit: 'cover',
										}}
									/>
									<span>
										<span className='font-bold'>Color:</span> {color}
									</span>
									<span>
										<span className='font-bold'>Hex:</span> {hexValue ?? ''}
									</span>
									<span>
										<span className='font-bold'>Stock:</span> {stock}
									</span>
								</List.Item>
							);
						}}
					/>
				</div>

				{/* upload image */}
				<div className='flex flex-col mt-3'>
					<Dragger
						listType='picture'
						onPreview={handlePreview}
						iconRender={() => <EyeOutlined />}
						beforeUpload={beforeUpload}
						onChange={handleChange}
						fileList={fileList}
						maxCount={1}
					>
						<p className='ant-upload-drag-icon'>
							<InboxOutlined />
						</p>
						<p className='ant-upload-text'>
							Click or drag file to this area to upload
						</p>
						<p className='ant-upload-hint'>Upload only Image Files</p>
					</Dragger>
					{previewImage && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: previewOpen,
								onVisibleChange: (visible) => setPreviewOpen(visible),
								afterOpenChange: (visible) => !visible && setPreviewImage(''),
							}}
							src={previewImage}
						/>
					)}

					<div className='flex flex-row gap-2 mt-2'>
						<Input
							placeholder='Color Name'
							value={colorName}
							onChange={(e) => setColorName(e.target.value)}
							className='rounded-lg h-8 text-sm border-gray-300 focus:border-coreBrown'
						/>
						<Input
							placeholder='Hex Value (optional)'
							value={hexValue}
							onChange={(e) => setHexValue(e.target.value)}
							className='rounded-lg h-8 text-sm border-gray-300 focus:border-coreBrown'
						/>
						<InputNumber
							controls
							placeholder='Stock'
							value={stock}
							onChange={(e) => setStock(parseInt(String(e)))}
							className='w-full h-8 text-sm border-gray-300 focus:border-coreBrown flex justify-start items-center rounded-lg'
						/>
					</div>

					<Button
						type='dashed'
						onClick={handleImageUpload}
						loading={loading}
						className='mt-2 border-coreBrown text-coreDarkBrown hover:!text-coreBrown hover:!border-coreDarkBrown !bg-coreLightPink'
					>
						Upload
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default ImageImport;
